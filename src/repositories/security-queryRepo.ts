import {SessionDBType} from "../types/types";
import {SessionModel} from "../types/mongoose-schemas-models";

type DeviceOutputModelType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export const securityQueryRepo = {
    async findUserSessions(userId: string): Promise<DeviceOutputModelType[]> {
        return (await SessionModel.find({userId}).lean()).map(s => this.getOutputModel(s))
    },
    getOutputModel(session: SessionDBType): DeviceOutputModelType {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: new Date(session.iat*1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}