import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {v4 as uuidv4} from 'uuid'
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
        deviceId = deviceId ? deviceId : uuidv4()
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_SECRET_FOR_REFRESHTOKEN, {expiresIn: '20s'})
        return {accessToken, refreshToken}
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
    async refreshTokens(refreshToken: string, ip: string, title: string): Promise<TypeTokens | null> {
        try {
            const usedSessionData = await this.getSessionDataByRefreshToken(refreshToken)
            if (!usedSessionData) return null
            const isValidRefreshToken =  await securityService.isValidSession({...usedSessionData, ip, title})
            if (!isValidRefreshToken) return null

            const tokens = await this.createJWT(usedSessionData.userId, usedSessionData.deviceId)
            const sessionData = await this.getSessionDataByRefreshToken(tokens.refreshToken)
            if (!title || !sessionData) return null

            await securityService.updateSessionData({...sessionData, ip, title})
            return tokens
        } catch (e) {
            return null
        }
    },
    async checkRefreshTokens(refreshToken: string, ip: string, title: string): Promise<boolean> {
        try {
            const sessionData = await this.getSessionDataByRefreshToken(refreshToken)
            if (!sessionData) return false
            const isValidRefreshToken =  await securityService.isValidSession({...sessionData, ip, title})
            if (!isValidRefreshToken) return false

            await securityService.deleteSessionByDeviceId(sessionData.userId, sessionData.deviceId)
            return true
        } catch (e) {
            return false
        }
    },
    async getSessionDataByRefreshToken(refreshToken: string): Promise<TypeRefreshTokenData | null> {
        try {
            return jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeRefreshTokenData
        } catch (e) {
            return null
        }
    },
}