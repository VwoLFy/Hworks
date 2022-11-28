import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {authService} from "../domain/auth-service";

type TypeDataInAccessToken = { userId: string }
type TypeDataInRefreshToken = {
    userId: string
    deviceId: string
}
type TypeTokens = {
    accessToken: string
    refreshToken: string
}
export const jwtService = {
    async createJWT(userId: string): Promise<TypeTokens> {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        const deviceId = 0
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_SECRET_FOR_REFRESHTOKEN, {expiresIn: '20s'})
        return {accessToken, refreshToken}
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as TypeDataInAccessToken
            return result.userId
        } catch (e) {
            return null
        }
    },
    async getUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeDataInRefreshToken
            return result.userId
        } catch (e) {
            return null
        }
    },
    async refreshTokens(refreshToken: string): Promise<TypeTokens | null> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeDataInRefreshToken
            const isValidRefreshToken = await authService.isValidRefreshToken(result.userId, refreshToken) //???
            if (!isValidRefreshToken) return null
            await authService.addOldRefreshTokenToBL(result.userId, refreshToken)
            return await this.createJWT(result.userId)
        } catch (e) {
            return null
        }
    },
    async checkRefreshTokens(refreshToken: string): Promise<boolean> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeDataInRefreshToken
            const isValidRefreshToken = await authService.isValidRefreshToken(result.userId, refreshToken)
            if (!isValidRefreshToken) return false
            await authService.addOldRefreshTokenToBL(result.userId, refreshToken)
            return true
        } catch (e) {
            return false
        }
    },
    async getSessionDataByRefreshToken(refreshToken: string): Promise<TypeDataInRefreshToken | null> {
        try {
            return jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeDataInRefreshToken
        } catch (e) {
            return null
        }
    },
}