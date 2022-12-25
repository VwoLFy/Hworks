import {Request} from "express";
import {RefreshTokenDataType} from "../../auth/application/jwt-service";

declare global {
    declare namespace Express {
        export interface Request {
            userId: string
            refreshTokenData: RefreshTokenDataType
        }
    }
}