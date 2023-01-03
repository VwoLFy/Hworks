import {AuthService} from "../application/auth-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepo} from "../../users/infrastructure/users-queryRepo";
import {RequestWithBody} from "../../main/types/types";
import {LoginUserDto} from "../application/dto/LoginUserDto";
import {Request, Response} from "express";
import {LoginSuccessViewModel} from "./models/LoginSuccessViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {PasswordRecoveryInputModel} from "./models/PasswordRecoveryInputModel";
import {NewPasswordRecoveryDto} from "../application/dto/NewPasswordRecoveryDto";
import {RegistrationConfirmationCodeModel} from "./models/RegistrationConfirmationCodeModel";
import {RegistrationEmailResendingModel} from "./models/RegistrationEmailResendingModel";
import {MeViewModel} from "./models/MeViewModel";
import {inject, injectable} from "inversify";
import {CreateUserDto} from "../../users/application/dto/CreateUserDto";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(JwtService) protected jwtService: JwtService,
                @inject(UsersQueryRepo)  protected usersQueryRepo: UsersQueryRepo) {
    }

    async loginUser(req: RequestWithBody<LoginUserDto>, res: Response<LoginSuccessViewModel>) {
        const ip = req.ip
        const title = req.headers["user-agent"] || 'unknown'

        const userId = await this.authService.checkCredentials({
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password
        })
        if (!userId) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

        const {accessToken, refreshToken} = await this.authService.loginUser(userId, ip, title)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_Status.OK_200).json({accessToken})
    }

    async passwordRecovery(req: RequestWithBody<PasswordRecoveryInputModel>, res: Response) {
        if (!req.body.email) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        await this.authService.passwordRecoverySendEmail(req.body.email)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async newPassword(req: RequestWithBody<NewPasswordRecoveryDto>, res: Response) {
        if (!req.body.newPassword || !req.body.recoveryCode) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)

        const isChangedPassword = await this.authService.changePassword({
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        })
        if (!isChangedPassword) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async refreshToken(req: Request, res: Response<LoginSuccessViewModel>) {
        const ip = req.ip
        const title = req.headers["user-agent"] || 'unknown'

        const {accessToken, refreshToken} = await this.jwtService.updateTokens(req.refreshTokenData, ip, title)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_Status.OK_200).json({accessToken})
    }

    async registration(req: RequestWithBody<CreateUserDto>, res: Response) {
        const isRegistered = await this.authService.createUser({
            login: req.body.login,
            password: req.body.password,
            email: req.body.email})
        if (!isRegistered) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCodeModel>, res: Response) {
        const isConfirm = await this.authService.confirmEmail(req.body.code)
        if (!isConfirm) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async registrationEmailResending(req: RequestWithBody<RegistrationEmailResendingModel>, res: Response) {
        const isResendEmail = await this.authService.registrationResendEmail(req.body.email)
        if (!isResendEmail) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async logout(req: Request, res: Response) {
        await this.jwtService.deleteRefreshToken(req.refreshTokenData)
        res.clearCookie('refreshToken')
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }

    async getMyInfo(req: Request, res: Response<MeViewModel>) {
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