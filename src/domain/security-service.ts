import {securityRepository} from "../repositories/security-repository";

export type TypeSessionData = {
    userId: string
    deviceId: string
}

export const securityService = {
    async deleteSessions(sessionData: TypeSessionData): Promise<boolean> {
        return await securityRepository.deleteSessions(sessionData)
    },
    async deleteSessionByDeviceId(sessionData: TypeSessionData): Promise<number> {
        const foundUserId = await securityRepository.findUserIdByDeviceId(sessionData.deviceId)
        if (!foundUserId) return 404
        if (foundUserId !== sessionData.userId) return 403
        return await securityRepository.deleteSessionByDeviceId(sessionData.deviceId)
    }
}