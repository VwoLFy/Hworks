import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {JwtService, RefreshTokenDataType} from "../application/jwt-service";

export const refreshTokenValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshTokenData: RefreshTokenDataType | null = await new JwtService().checkAndGetRefreshTokenData(req.cookies.refreshToken)
    if (!refreshTokenData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

    req.refreshTokenData = refreshTokenData
    next()
}