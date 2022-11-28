import {deviceCollection} from "./db";
import {TypeSessionData} from "../domain/security-service";

export const securityRepository = {
    async deleteSessions(sessionData: TypeSessionData): Promise<boolean> {
        const deleteFilter = {userId: sessionData.userId, deviceId: {$ne: sessionData.deviceId}}
        const result = await deviceCollection.deleteMany(deleteFilter)
        return !!result.deletedCount
    },
    async findUserIdByDeviceId(deviceId: string): Promise<string | null> {
        return await deviceCollection.findOne({deviceId}, {projection: {userId: 1, _id: 0}}) as string | null
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<number> {
        const result = await deviceCollection.deleteOne({deviceId})
        return result.deletedCount ? 204 : 404
    }
}