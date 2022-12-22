import {NextFunction, Request, Response} from "express";
import {jwtService} from "../composition-root";

export const getUserIdAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer")) {
        const accessToken = authorization.split(" ")[1]
        const userId = await jwtService.getUserIdByAccessToken(accessToken)
        if (userId) req.userId = userId
    }
    next()
}