import {securityRepository} from "../repositories/security-repository";
import {TypeSession, TypeShortSessionData} from "../types/types";

export const securityService = {
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        return await securityRepository.deleteSessions(userId, deviceId)
    },
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const foundUserId = await securityRepository.findUserIdByDeviceId(deviceId)
        if (!foundUserId) return 404
        if (foundUserId.userId !== userId) return 403
        return await securityRepository.deleteSessionByDeviceId(userId, deviceId)
    },
    async saveSession(sessionData: TypeSession): Promise<void> {
        await securityRepository.saveSession(sessionData)
    },
    async updateSessionData(sessionData: TypeSession) {
        await securityRepository.updateSessionData(sessionData)
    },
    async isValidSession(shortSessionData: TypeShortSessionData): Promise<boolean> {
        return await securityRepository.isValidSession(shortSessionData)
    },
    async deleteAll() {
        await securityRepository.deleteAll()
    },
    async newDeviceId(): Promise<string> {
        return String((await securityRepository.maxValueActiveDeviceId()) + 1);
    }
}