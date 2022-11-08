import {Response, Router} from "express";
import {RequestWithBody} from "../types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {loginService} from "../domain/login-service";
import {postLoginValidation} from "../middlewares/validators";

export const loginRouter = Router({})

loginRouter.post('/', postLoginValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response) => {
    const isAuth = await loginService.authUser(req.body.login, req.body.password)
    if (!isAuth) {
        res.sendStatus(401)
    } else {
        res.sendStatus(204)
    }
})