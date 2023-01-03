import jwt from 'jsonwebtoken'
import {settings} from "../../main/settings";
import {SecurityService} from "../../security/application/security-service";
import {inject, injectable} from "inversify";

type AccessTokenDataType = { userId: string }
export type RefreshTokenDataType = {
    userId: string
    deviceId: string
    iat: number
    exp: number
}
type TokensType = {
    accessToken: string
    refreshToken: string
}

@injectable()
export class JwtService{
    constructor(@inject(SecurityService) protected securityService: SecurityService) {}

    async createJWT(userId: string, deviceId: string | null): Promise<TokensType> {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10m'})
        deviceId = deviceId ? deviceId : await this.securityService.newDeviceId()
        const refreshToken = jwt.sign({userId, deviceId}, settings.JWT_SECRET_FOR_REFRESHTOKEN, {expiresIn: '1d'})
        return {accessToken, refreshToken}
    }
    async updateTokens(usedRefreshTokenData: RefreshTokenDataType, ip: string, title: string): Promise<TokensType> {
        const tokens = await this.createJWT(usedRefreshTokenData.userId, usedRefreshTokenData.deviceId)
        const newRefreshTokenData = await this.getRefreshTokenData(tokens.refreshToken)

        await this.securityService.updateSessionData({...newRefreshTokenData, ip, title})
        return tokens
    }
    async deleteRefreshToken(refreshTokenData: RefreshTokenDataType) {
        await this.securityService.deleteSessionByDeviceId(refreshTokenData.userId, refreshTokenData.deviceId)
    }
    async checkAndGetRefreshTokenData(refreshToken: string): Promise<RefreshTokenDataType | null> {
        try {
            const refreshTokenData =  jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as RefreshTokenDataType
            const isActiveRefreshToken = await this.securityService.isValidSession({...refreshTokenData})
            return isActiveRefreshToken ? refreshTokenData : null
        } catch (e) {
            return null
        }
    }
    async getRefreshTokenData(refreshToken: string): Promise<RefreshTokenDataType> {
        return jwt.decode(refreshToken) as RefreshTokenDataType
    }
    async getUserIdByAccessToken(accessToken: string): Promise<string | null> {
        try {
            const result = jwt.verify(accessToken, settings.JWT_SECRET) as AccessTokenDataType
            return result.userId
        } catch (e) {
            return null
        }
    }
}