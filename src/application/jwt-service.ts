import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {securityService} from "../domain/security-service";

type TypeAccessTokenData = { userId: string }
type TypeRefreshTokenData = {
    userId: string
    deviceId: string
    iat: number
    exp: number
}
type TypeTokens = {
    accessToken: string
    refreshToken: string
}

export const jwtService = {
    async createJWT(userId: string, deviceId: string | null): Promise<TypeTokens> {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        deviceId = deviceId ? deviceId : await securityService.newDeviceId()
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_SECRET_FOR_REFRESHTOKEN, {expiresIn: '20s'})
        return {accessToken, refreshToken}
    },
    async updateTokens(refreshToken: string, ip: string, title: string): Promise<TypeTokens | null> {
        const usedRefreshTokenData = await this.checkAndGetRefreshTokenData(refreshToken)
        if (!usedRefreshTokenData) return null
        const isActiveRefreshToken = await securityService.isValidSession({...usedRefreshTokenData, ip, title})
        if (!isActiveRefreshToken) return null

        const tokens = await this.createJWT(usedRefreshTokenData.userId, usedRefreshTokenData.deviceId)
        const newRefreshTokenData = await this.getRefreshTokenData(tokens.refreshToken)

        await securityService.updateSessionData({...newRefreshTokenData, ip, title})
        return tokens
    },
    async deleteRefreshToken(refreshToken: string, ip: string, title: string): Promise<boolean> {
        const refreshTokenData = await this.checkAndGetRefreshTokenData(refreshToken)
        if (!refreshTokenData) return false
        const isActiveRefreshToken = await securityService.isValidSession({...refreshTokenData, ip, title})
        if (!isActiveRefreshToken) return false

        await securityService.deleteSessionByDeviceId(refreshTokenData.userId, refreshTokenData.deviceId)
        return true
    },
    async checkAndGetRefreshTokenData(refreshToken: string): Promise<TypeRefreshTokenData | null> {
        try {
            return jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeRefreshTokenData
        } catch (e) {
            return null
        }
    },
    async getRefreshTokenData(refreshToken: string): Promise<TypeRefreshTokenData> {
        return jwt.decode(refreshToken) as TypeRefreshTokenData
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as TypeAccessTokenData
            return result.userId
        } catch (e) {
            return null
        }
    },
    async getUserIdByRefreshToken(refreshToken: string): Promise<string | null> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeRefreshTokenData
            return result.userId
        } catch (e) {
            return null
        }
    },
}