import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {securityService} from "../domain/security-service";

type TypeAccessTokenData = { userId: string }
export type TypeRefreshTokenData = {
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
    async updateTokens(usedRefreshTokenData: TypeRefreshTokenData, ip: string, title: string): Promise<TypeTokens> {
        const tokens = await this.createJWT(usedRefreshTokenData.userId, usedRefreshTokenData.deviceId)
        const newRefreshTokenData = await this.getRefreshTokenData(tokens.refreshToken)

        await securityService.updateSessionData({...newRefreshTokenData, ip, title})
        return tokens
    },
    async deleteRefreshToken(refreshTokenData: TypeRefreshTokenData) {
        await securityService.deleteSessionByDeviceId(refreshTokenData.userId, refreshTokenData.deviceId)
    },
    async checkAndGetRefreshTokenData(refreshToken: string): Promise<TypeRefreshTokenData | null> {
        try {
            const refreshTokenData =  jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeRefreshTokenData
            const isActiveRefreshToken = await securityService.isValidSession({...refreshTokenData})
            return isActiveRefreshToken ? refreshTokenData : null
        } catch (e) {
            return null
        }
    },
    async getRefreshTokenData(refreshToken: string): Promise<TypeRefreshTokenData> {
        return jwt.decode(refreshToken) as TypeRefreshTokenData
    },
    async getUserIdByAccessToken(accessToken: string): Promise<string | null> {
        try {
            const result = jwt.verify(accessToken, settings.JWT_SECRET) as TypeAccessTokenData
            return result.userId
        } catch (e) {
            return null
        }
    },
}