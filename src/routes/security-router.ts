import {Request, Response, Router} from "express";
import {DeviceViewModelType} from "../models/DeviceViewModel";
import {SecurityQueryRepo} from "../repositories/security-queryRepo";
import {HTTP_Status} from "../types/enums";
import {SecurityService} from "../domain/security-service";
import {RequestWithParam} from "../types/types";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";

export const securityRouter = Router({})

class SecurityController {
    private securityQueryRepo: SecurityQueryRepo;
    private securityService: SecurityService;

    constructor() {
        this.securityQueryRepo = new SecurityQueryRepo()
        this.securityService = new SecurityService()
    }

    async getDevices(req: Request, res: Response<DeviceViewModelType[]>) {
        const foundActiveDevices = await this.securityQueryRepo.findUserSessions(req.refreshTokenData.userId)
        if (!foundActiveDevices) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
        return res.status(HTTP_Status.OK_200).json(foundActiveDevices)
    }
    async deleteDevices(req: Request, res: Response) {
        const isDeletedSessions = await this.securityService.deleteSessions(req.refreshTokenData.userId, req.refreshTokenData.deviceId)
        if (!isDeletedSessions) return res.sendStatus(HTTP_Status.UNAUTHORIZED_401)
        return res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
    async deleteDevice(req: RequestWithParam, res: Response) {
        const result = await this.securityService.deleteSessionByDeviceId(req.refreshTokenData.userId, req.params.id)
        res.sendStatus(result as HTTP_Status)
        return
    }
}

const securityController = new SecurityController()

securityRouter.get('/devices', refreshTokenValidationMiddleware, securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', refreshTokenValidationMiddleware, securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:id', refreshTokenValidationMiddleware, securityController.deleteDevice.bind(securityController))