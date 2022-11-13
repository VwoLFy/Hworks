import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtService = {
    async createJWT(userId: string): Promise<TypeLoginSuccessViewModel> {
        const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '77d'})
        return {accessToken: token}
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        }
        catch (e) {
            return null
        }
    }
}