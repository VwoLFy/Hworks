import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModelType} from "../models/LoginInputModel";
import {
    emailConfirmationAuthValidation, emailResendingAuthValidation,
    getUserInfoAuthValidation,
    loginAuthValidation, newPasswordAuthValidation, passwordRecoveryAuthValidation,
    registrationAuthValidation
} from "../middlewares/user-auth-validators";
import {LoginSuccessViewModelType} from "../models/LoginSuccessViewModel";
import {jwtService} from "../application/jwt-service";
import {MeViewModelType} from "../models/MeViewModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {HTTP_Status} from "../types/enums";
import {UserInputModelType} from "../models/UserInputModel";
import {authService} from "../domain/auth-service";
import {RegistrationConfirmationCodeModelType} from "../models/RegistrationConfirmationCodeModel";
import {RegistrationEmailResendingType} from "../models/RegistrationEmailResending";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";
import {PasswordRecoveryInputModelType} from "../models/PasswordRecoveryInputModel";
import {NewPasswordRecoveryInputModelType} from "../models/NewPasswordRecoveryInputModel";

export const authRouter = Router({})

authRouter.post('/login', loginAuthValidation, async (req: RequestWithBody<LoginInputModelType>, res: Response<LoginSuccessViewModelType>) => {
    const ip = req.ip
    const title = req.headers["user-agent"] || 'unknown'

    const userId = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!userId) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

    const {accessToken, refreshToken} = await authService.loginUser(userId, ip, title)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    return res.status(HTTP_Status.OK_200).json({accessToken})
})
authRouter.post('/password-recovery', passwordRecoveryAuthValidation, async (req: RequestWithBody<PasswordRecoveryInputModelType>, res: Response) => {
    if (!req.body.email) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    await authService.passwordRecoverySendEmail(req.body.email)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/new-password', newPasswordAuthValidation, async (req: RequestWithBody<NewPasswordRecoveryInputModelType>, res: Response) => {
    if (!req.body.newPassword || !req.body.recoveryCode) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)

    const isChangedPassword = await authService.changePassword(req.body.newPassword, req.body.recoveryCode)
    if (!isChangedPassword) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/refresh-token', refreshTokenValidationMiddleware, async (req: Request, res: Response<LoginSuccessViewModelType>) => {
    const ip = req.ip
    const title = req.headers["user-agent"] || 'unknown'

    const {accessToken, refreshToken} = await jwtService.updateTokens(req.refreshTokenData, ip, title)

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    return res.status(HTTP_Status.OK_200).json({accessToken})
})
authRouter.post('/registration', registrationAuthValidation, async (req: RequestWithBody<UserInputModelType>, res: Response) => {
    const isRegistered = await authService.createUser(req.body.login, req.body.password, req.body.email)
    if (!isRegistered) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/registration-confirmation', emailConfirmationAuthValidation, async (req: RequestWithBody<RegistrationConfirmationCodeModelType>, res: Response) => {
    const isConfirm = await authService.confirmEmail(req.body.code)
    if (!isConfirm) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/registration-email-resending', emailResendingAuthValidation, async (req: RequestWithBody<RegistrationEmailResendingType>, res: Response) => {
    const isResendEmail = await authService.registrationResendEmail(req.body.email)
    if (!isResendEmail) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/logout', refreshTokenValidationMiddleware, async (req: Request, res: Response) => {
    await jwtService.deleteRefreshToken(req.refreshTokenData)
    res.clearCookie('refreshToken')
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.get('/me', getUserInfoAuthValidation, async (req: Request, res: Response<MeViewModelType>) => {
    const userId = req.userId
    const userData = await usersQueryRepo.findUserById(userId)
    if (!userData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
    return res.status(HTTP_Status.OK_200).json({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})