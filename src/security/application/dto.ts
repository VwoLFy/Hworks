import {RefreshTokenDataType} from "../../auth/application/jwt-service";

export type SessionDTO = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}
export type ShortSessionDTO = RefreshTokenDataType