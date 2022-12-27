import {SecurityQueryRepo} from "../repositories/security-queryRepo";
import {SecurityService} from "../domain/security-service";
import {Request, Response} from "express";
import {DeviceViewModelType} from "../models/DeviceViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {RequestWithParam} from "../../main/types/types";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityController {
    constructor(@inject(SecurityQueryRepo) protected securityQueryRepo: SecurityQueryRepo,
                @inject(SecurityService) protected securityService: SecurityService) {
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