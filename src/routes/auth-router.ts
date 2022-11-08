import {Response, Router} from "express";
import {RequestWithBody} from "../types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {postAuthValidation} from "../middlewares/validators";
import {usersService} from "../domain/user-service";

export const authRouter = Router({})

authRouter.post('/', postAuthValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response) => {
    const isAuth = await usersService.authUser(req.body.login, req.body.password)
    if (!isAuth) {
        res.sendStatus(401)
    } else {
        res.sendStatus(204)
    }
})