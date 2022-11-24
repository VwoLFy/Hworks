import jwt from 'jsonwebtoken'
import {settings} from "../settings";

type TypeUserId = { userId: string }
type TypeTokens = {
    accessToken: string
    refreshToken: string
}
export const jwtService = {
    async createJWT(userId: string): Promise<TypeTokens> {
        const accessToken = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId}, settings.JWT_SECRET_FOR_REFRESHTOKEN, {expiresIn: '20s'})
        return {accessToken, refreshToken}
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as TypeUserId
            return result.userId
        } catch (e) {
            return null
        }
    },
    async refreshTokens(refreshToken: string): Promise<TypeTokens | null> {
        try {
            const result = jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN) as TypeUserId
            return await this.createJWT(result.userId)
        } catch (e) {
            return null
        }
    },
    async checkRefreshTokens(refreshToken: string): Promise<boolean> {
        try {
            jwt.verify(refreshToken, settings.JWT_SECRET_FOR_REFRESHTOKEN)
            return true
        } catch (e) {
            return false
        }
    }
}