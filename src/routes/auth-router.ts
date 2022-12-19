import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModelType} from "../models/LoginInputModel";
import {
    emailConfirmationAuthValidation, emailResendingAuthValidation,
    getMyInfoAuthValidation,
    loginAuthValidation, newPasswordAuthValidation, passwordRecoveryAuthValidation,
    registrationAuthValidation
} from "../middlewares/user-auth-validators";
import {LoginSuccessViewModelType} from "../models/LoginSuccessViewModel";
import {JwtService} from "../application/jwt-service";
import {MeViewModelType} from "../models/MeViewModel";
import {UsersQueryRepo} from "../repositories/users-queryRepo";
import {HTTP_Status} from "../types/enums";
import {UserInputModelType} from "../models/UserInputModel";
import {AuthService} from "../domain/auth-service";
import {RegistrationConfirmationCodeModelType} from "../models/RegistrationConfirmationCodeModel";
import {RegistrationEmailResendingType} from "../models/RegistrationEmailResending";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";
import {PasswordRecoveryInputModelType} from "../models/PasswordRecoveryInputModel";
import {NewPasswordRecoveryInputModelType} from "../models/NewPasswordRecoveryInputModel";

export const authRouter = Router({})

class AuthController {
    private authService: AuthService;
    private jwtService: JwtService;
    private usersQueryRepo: UsersQueryRepo;

    constructor() {
        this.authService = new AuthService()
        this.jwtService = new JwtService()
        this.usersQueryRepo = new UsersQueryRepo()
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
        const isRegistered = await this.authService.createUser(req.body.login, req.body.password, req.body.email)
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

const authController = new AuthController()

authRouter.post('/login', loginAuthValidation, authController.loginUser.bind(authController))
authRouter.post('/password-recovery', passwordRecoveryAuthValidation, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', newPasswordAuthValidation, authController.newPassword.bind(authController))
authRouter.post('/refresh-token', refreshTokenValidationMiddleware, authController.refreshToken.bind(authController))
authRouter.post('/registration', registrationAuthValidation, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', emailConfirmationAuthValidation, authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', emailResendingAuthValidation, authController.registrationEmailResending.bind(authController))
authRouter.post('/logout', refreshTokenValidationMiddleware, authController.logout.bind(authController))
authRouter.get('/me', getMyInfoAuthValidation, authController.getMyInfo.bind(authController))