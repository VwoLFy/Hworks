import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {
    emailConfirmationAuthValidation, emailResendingAuthValidation,
    getUserInfoAuthValidation,
    loginAuthValidation,
    registrationAuthValidation
} from "../middlewares/user-auth-validators";
import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import {jwtService} from "../application/jwt-service";
import {TypeMeViewModel} from "../models/MeViewModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {HTTP_Status} from "../types/enums";
import {TypeUserInputModel} from "../models/UserInputModel";
import {authService} from "../domain/auth-service";
import {TypeRegistrationConfirmationCodeModel} from "../models/RegistrationConfirmationCodeModel";
import {TypeRegistrationEmailResending} from "../models/RegistrationEmailResending";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";

export const authRouter = Router({})

authRouter.post('/login', loginAuthValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response<TypeLoginSuccessViewModel>) => {
    const ip = req.ip
    const title = req.headers["user-agent"] || 'unknown'

    const userId = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!userId) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

    const {accessToken, refreshToken} = await authService.loginUser(userId, ip, title)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    return res.status(HTTP_Status.OK_200).json({accessToken})
})
authRouter.post('/refresh-token', refreshTokenValidationMiddleware, async (req: Request, res: Response<TypeLoginSuccessViewModel>) => {
    const ip = req.ip
    const title = req.headers["user-agent"] || 'unknown'

    const {accessToken, refreshToken} = await jwtService.updateTokens(req.refreshTokenData, ip, title)

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
    return res.status(HTTP_Status.OK_200).json({accessToken})
})
authRouter.post('/logout', refreshTokenValidationMiddleware, async (req: Request, res: Response) => {
    await jwtService.deleteRefreshToken(req.refreshTokenData)
    res.clearCookie('refreshToken')
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/registration', registrationAuthValidation, async (req: RequestWithBody<TypeUserInputModel>, res: Response) => {
    const isRegistered = await authService.createUser(req.body.login, req.body.password, req.body.email)
    if (!isRegistered) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/registration-confirmation', emailConfirmationAuthValidation, async (req: RequestWithBody<TypeRegistrationConfirmationCodeModel>, res: Response) => {
    const isConfirm = await authService.confirmEmail(req.body.code)
    if (!isConfirm) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.post('/registration-email-resending', emailResendingAuthValidation, async (req: RequestWithBody<TypeRegistrationEmailResending>, res: Response) => {
    const isResendEmail = await authService.registrationResendEmail(req.body.email)
    if (!isResendEmail) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
authRouter.get('/me', getUserInfoAuthValidation, async (req: Request, res: Response<TypeMeViewModel>) => {
    const userId = req.userId
    const userData = await usersQueryRepo.findUserById(userId)
    if (!userData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
    return res.status(HTTP_Status.OK_200).json({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})