import {deviceCollection} from "./db";

type TypeDeviceOutputModel = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export const securityQueryRepo = {
    async findUserDevices(userId: string): Promise<TypeDeviceOutputModel[]> {
    return deviceCollection.find({userId}, {projection: {ip: 1, title: 1, lastActiveDate: 1, deviceId: 1, _id: 0}}).toArray()
    }
}