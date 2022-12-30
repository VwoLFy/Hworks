import {SessionClass} from "../types/types";
import {SessionModel} from "../types/mongoose-schemas-models";
import {injectable} from "inversify";

type DeviceOutputModelType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

@injectable()
export class SecurityQueryRepo {
    async findUserSessions(userId: string): Promise<DeviceOutputModelType[]> {
        return (await SessionModel.find({userId}).lean()).map(s => this.getOutputModel(s))
    }
    getOutputModel(session: SessionClass): DeviceOutputModelType {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: new Date(session.iat*1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}