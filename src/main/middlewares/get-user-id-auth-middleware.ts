import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {JwtService} from "../../auth/application/jwt-service";

export const getUserIdAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.split(" ")[1]
        const userId = await container.resolve(JwtService).getUserIdByAccessToken(accessToken)
        if (userId) req.userId = userId
    }
    next()
}