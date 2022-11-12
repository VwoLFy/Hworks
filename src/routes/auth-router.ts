import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {postAuthValidation} from "../middlewares/validators";
import {usersService} from "../domain/user-service";
import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import {jwtService} from "../application/jwt-service";
import {TypeMeViewModel} from "../models/MeViewModel";

export const authRouter = Router({})

authRouter.post('/login', postAuthValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response<TypeLoginSuccessViewModel>) => {
    const userId = await usersService.authUser(req.body.login, req.body.password)
    if (!userId) return res.sendStatus(401)

    const token = await jwtService.createJWT(userId)
    return res.status(200).json(token)
})
authRouter.get('/me', async (req: Request, res: Response<TypeMeViewModel>) => {

    return res.sendStatus(200)
})