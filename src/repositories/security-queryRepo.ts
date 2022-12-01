import {sessionCollection} from "./db";
import {TypeSessionDB} from "../types/types";

type TypeDeviceOutputModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export const securityQueryRepo = {
    async findUserSessions(userId: string): Promise<TypeDeviceOutputModel[]> {
        return (await sessionCollection.find({userId}).toArray()).map(s => this.getOutputModel(s))
    },
    getOutputModel(session: TypeSessionDB): TypeDeviceOutputModel {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: new Date(session.iat*1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}