import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {JwtService, RefreshTokenDataType} from "../../auth/application/jwt-service";
import {container} from "../composition-root";

export const refreshTokenValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenData: RefreshTokenDataType | null = await container.resolve(JwtService).checkAndGetRefreshTokenData(req.cookies.refreshToken)
    if (!refreshTokenData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

    req.refreshTokenData = refreshTokenData
    next()
}