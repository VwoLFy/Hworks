import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
type TypeUserId = {userId: string}

export const jwtService = {
    async createJWT(userId: string): Promise<TypeLoginSuccessViewModel> {
        const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '77d'})
        return {accessToken: token}
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as TypeUserId
            return result.userId
        }
        catch (e) {
            return null
        }
    }
}