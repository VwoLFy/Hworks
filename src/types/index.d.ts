import {Request} from "express";
import {RefreshTokenDataType} from "../application/jwt-service";

declare global {
    declare namespace Express {
        export interface Request {
            userId: string
            refreshTokenData: RefreshTokenDataType
        }
    }
}