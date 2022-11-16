import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/types";
import {TypeLoginInputModel} from "../models/LoginInputModel";
import {getAuthValidation, postAuthValidation} from "../middlewares/validators";
import {usersService} from "../domain/user-service";
import {TypeLoginSuccessViewModel} from "../models/LoginSuccessViewModel";
import {jwtService} from "../application/jwt-service";
import {TypeMeViewModel} from "../models/MeViewModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {HTTP_Status} from "../enums";

export const authRouter = Router({})

authRouter.post('/login', postAuthValidation, async (req: RequestWithBody<TypeLoginInputModel>, res: Response<TypeLoginSuccessViewModel>) => {
    const userId = await usersService.authUser(req.body.login, req.body.password)
    if (!userId) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)

    const token = await jwtService.createJWT(userId)
    return res.status(HTTP_Status.OK_200).json(token)
})
authRouter.get('/me', getAuthValidation, async (req: Request, res: Response<TypeMeViewModel>) => {
    const userId = req.userId
    const userData = await usersQueryRepo.findUserById(userId)
    if (!userData) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
    return res.status(HTTP_Status.OK_200).json({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})