import {SessionClass, SessionDtoType, ShortSessionDtoType} from "../types/types";
import {SessionModel} from "../types/mongoose-schemas-models";

class SecurityRepository {
    async findUserIdByDeviceId(deviceId: string): Promise<{ userId: string } | null> {
        return await SessionModel.findOne({deviceId})
            .select({userId: 1, _id: 0}) as { userId: string } | null
    }
    async saveSession(newSession: SessionClass): Promise<void> {
        await SessionModel.create(newSession)
    }
    async updateSessionData(sessionData: SessionDtoType) {
        const filter = {
            deviceId: sessionData.deviceId,
            userId: sessionData.userId
        }
        const update = {
            $set: {
                ip: sessionData.ip,
                title: sessionData.title,
                exp: sessionData.exp,
                iat: sessionData.iat
            }
        }
        await SessionModel.updateOne(filter, update)
    }
    async isValidSession(shortSessionData: ShortSessionDtoType): Promise<boolean> {
        const filter = {
            iat: shortSessionData.iat,
            deviceId: shortSessionData.deviceId,
            userId: shortSessionData.userId
        }
        return !!(await SessionModel.findOne(filter))
    }
    async maxValueActiveDeviceId(): Promise<number> {
        return (await SessionModel.find()
            .sort({'deviceId': -1})
            .limit(1)
            .lean())
            .reduce((acc, it) => acc > +it.deviceId ? acc : +it.deviceId, 0)
    }
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        const deleteFilter = {userId, deviceId: {$ne: deviceId}}
        const result = await SessionModel.deleteMany(deleteFilter)
        return !!result.deletedCount
    }
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const result = await SessionModel.deleteOne({userId, deviceId})
        return result.deletedCount ? 204 : 404
    }
    async deleteAll() {
        await SessionModel.deleteMany({})
    }
}

export const securityRepository = new SecurityRepository()