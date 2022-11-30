import {securityRepository} from "../repositories/security-repository";

export type TypeSessionData = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}

export const securityService = {
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        return await securityRepository.deleteSessions(userId, deviceId)
    },
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const foundUserId = await securityRepository.findUserIdByDeviceId(deviceId)
        if (!foundUserId) return 404
        if (foundUserId.userId !== userId) return 403
        return await securityRepository.deleteSessionByDeviceId(deviceId)
    },
    async saveSession(sessionData: TypeSessionData): Promise<void> {
        await securityRepository.saveSession(sessionData)
    },
    async updateSessionData(sessionData: TypeSessionData) {
        await securityRepository.updateSessionData(sessionData)
    },
    async isValidSession(sessionData: TypeSessionData): Promise<boolean> {
        return await securityRepository.isValidSession(sessionData)
    }
}