import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";

export const jwtService = {
    async createJWT(userId: string): Promise<TypeLoginSuccessViewModel> {
        const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '77d'})
        return {accessToken: token}
    }
}