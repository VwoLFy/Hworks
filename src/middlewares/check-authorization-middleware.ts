import {NextFunction, Request, Response} from "express";
import {atob} from "buffer";

export const checkAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header("Authorization");
    if (!authorization?.startsWith("Basic") || authorization?.indexOf(":") > -1) {
        return res.sendStatus(401);
    }
    const [login, pass] = atob(authorization?.split(" ")[1]).split(":");
    if (login !== "admin" || pass !== "qwerty") {
        return res.sendStatus(401);
    } else {
        next();
    }
}