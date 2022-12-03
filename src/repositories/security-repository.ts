import {sessionCollection} from "./db";
import {TypeSessionData} from "../domain/security-service";
import {ObjectId} from "mongodb";
import {TypeShortSessionData} from "../types/types";

export const securityRepository = {
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        const deleteFilter = {userId, deviceId: {$ne: deviceId}}
        const result = await sessionCollection.deleteMany(deleteFilter)
        return !!result.deletedCount
    },
    async findUserIdByDeviceId(deviceId: string): Promise<{userId: string} | null> {
        return await sessionCollection.findOne({deviceId}, {
            projection: {
                userId: 1,
                _id: 0
            }
        }) as {userId: string} | null
    },
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const result = await sessionCollection.deleteOne({userId, deviceId})
        return result.deletedCount ? 204 : 404
    },
    async saveSession(sessionData: TypeSessionData): Promise<void> {
        await sessionCollection.insertOne({...sessionData, _id: new ObjectId()})
    },
    async updateSessionData(sessionData: TypeSessionData) {
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
        await sessionCollection.updateOne(filter, update)
    },
    async isValidSession(shortSessionData: TypeShortSessionData): Promise<boolean> {
        const filter = {
            iat: shortSessionData.iat,
            deviceId: shortSessionData.deviceId,
            userId: shortSessionData.userId
        }
        return !!(await sessionCollection.findOne(filter))
    },
    async deleteAll() {
        await sessionCollection.deleteMany({})
    },
    async sessionCount(): Promise<number> {
        return await sessionCollection.count({})
    }
}