import {Request, Response, Router} from "express";
import {TypeDeviceViewModel} from "../models/DeviceViewModel";
import {securityQueryRepo} from "../repositories/security-queryRepo";
import {HTTP_Status} from "../types/enums";
import {securityService} from "../domain/security-service";
import {RequestWithParam} from "../types/types";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";

export const securityRouter = Router({})

securityRouter.get('/devices', refreshTokenValidationMiddleware, async (req: Request, res: Response<TypeDeviceViewModel[]>) => {
    const foundActiveDevices = await securityQueryRepo.findUserSessions(req.refreshTokenData.userId)
    if (!foundActiveDevices) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
    return res.status(HTTP_Status.OK_200).json(foundActiveDevices)
})
securityRouter.delete('/devices', refreshTokenValidationMiddleware, async (req: Request, res: Response) => {
    const isDeletedSessions = await securityService.deleteSessions(req.refreshTokenData.userId, req.refreshTokenData.deviceId)
    if (!isDeletedSessions) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
    return res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
securityRouter.delete('/devices/:id', refreshTokenValidationMiddleware, async (req: RequestWithParam, res: Response) => {
    const result = await securityService.deleteSessionByDeviceId(req.refreshTokenData.userId, req.params.id)
    res.sendStatus(result as HTTP_Status)
    return
})