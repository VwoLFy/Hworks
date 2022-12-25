import {AuthService} from "../domain/auth-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepo} from "../../users/repositories/users-queryRepo";
import {RequestWithBody} from "../../main/types/types";
import {LoginInputModelType} from "../models/LoginInputModel";
import {Request, Response} from "express";
import {LoginSuccessViewModelType} from "../models/LoginSuccessViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {PasswordRecoveryInputModelType} from "../models/PasswordRecoveryInputModel";
import {NewPasswordRecoveryInputModelType} from "../models/NewPasswordRecoveryInputModel";
import {UserInputModelType} from "../../users/models/UserInputModel";
import {RegistrationConfirmationCodeModelType} from "../models/RegistrationConfirmationCodeModel";
import {RegistrationEmailResendingType} from "../models/RegistrationEmailResending";
import {MeViewModelType} from "../models/MeViewModel";

export class AuthController {
    constructor(protected authService: AuthService,
                protected jwtService: JwtService,
                protected usersQueryRepo: UsersQueryRepo) {
    }

    async loginUser(req: RequestWithBody<LoginInputModelType>, res: Response<LoginSuccessViewModelType>) {
        const ip = req.ip
        const title = req.headers["user-agent"] || 'unknown'

        const userId = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!userId) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

        const {accessToken, refreshToken} = await this.authService.loginUser(userId, ip, title)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_Status.OK_200).json({accessToken})
    }

    async passwordRecovery(req: RequestWithBody<PasswordRecoveryInputModelType>, res: Response) {
        if (!req.body.email) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        await this.authService.passwordRecoverySendEmail(req.body.email)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async newPassword(req: RequestWithBody<NewPasswordRecoveryInputModelType>, res: Response) {
        if (!req.body.newPassword || !req.body.recoveryCode) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)

        const isChangedPassword = await this.authService.changePassword(req.body.newPassword, req.body.recoveryCode)
        if (!isChangedPassword) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async refreshToken(req: Request, res: Response<LoginSuccessViewModelType>) {
        const ip = req.ip
        const title = req.headers["user-agent"] || 'unknown'

        const {accessToken, refreshToken} = await this.jwtService.updateTokens(req.refreshTokenData, ip, title)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_Status.OK_200).json({accessToken})
    }

    async registration(req: RequestWithBody<UserInputModelType>, res: Response) {
        const isRegistered = await this.authService.createUser({
            login: req.body.login,
            password: req.body.password,
            email: req.body.email})
        if (!isRegistered) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCodeModelType>, res: Response) {
        const isConfirm = await this.authService.confirmEmail(req.body.code)
        if (!isConfirm) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async registrationEmailResending(req: RequestWithBody<RegistrationEmailResendingType>, res: Response) {
        const isResendEmail = await this.authService.registrationResendEmail(req.body.email)
        if (!isResendEmail) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async logout(req: Request, res: Response) {
        await this.jwtService.deleteRefreshToken(req.refreshTokenData)
        res.clearCookie('refreshToken')
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async getMyInfo(req: Request, res: Response<MeViewModelType>) {
        const userId = req.userId
        const userData = await this.usersQueryRepo.findUserById(userId)
        if (!userData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
        return res.status(HTTP_Status.OK_200).json({
            email: userData.email,
            login: userData.login,
            userId: userData.id
        })
    }
}