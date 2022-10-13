import {NextFunction, Request, Response} from "express";
import {atob, btoa} from "buffer";

export const checkAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let authorization = req.header("Authorization");
    if (!authorization?.startsWith("Basic")) {
        return res.sendStatus(401);
    }
    authorization = authorization?.split(" ")[0] +" " + btoa(authorization?.split(" ")[1]);
    const [login, pass] = atob(authorization?.split(" ")[1]).split(":");
    if (login !== "admin" || pass !== "qwerty") {
        return res.sendStatus(401);
    } else {
        next();
    }
}