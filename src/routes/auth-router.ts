import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {getAuthValidation, postAuthValidation} from "../middlewares/validators";
import {usersService} from "../domain/user-service";
import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import {jwtService} from "../application/jwt-service";
import {TypeMeViewModel} from "../models/MeViewModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";

export const authRouter = Router({})

authRouter.post('/login', postAuthValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response<TypeLoginSuccessViewModel>) => {
    const userId = await usersService.authUser(req.body.login, req.body.password)
    if (!userId) return res.sendStatus(401)

    const token = await jwtService.createJWT(userId)
    return res.status(200).json(token)
})
authRouter.get('/me', getAuthValidation, async (req: Request, res: Response<TypeMeViewModel>) => {
    const userId = req.userId
    const userData = await usersQueryRepo.findUserById(userId)
    if (!userData) return
    return res.status(200).json({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})