import {Request} from "express";
import {TypeRefreshTokenData} from "../application/jwt-service";

declare global {
    declare namespace Express {
        export interface Request {
            userId: string
            refreshTokenData: TypeRefreshTokenData
        }
    }
}