import {securityRepository} from "../repositories/security-repository";
import {SessionClass, SessionDtoType, ShortSessionDtoType} from "../types/types";

class SecurityService {
    async saveSession(sessionData: SessionDtoType): Promise<void> {
        const {userId, exp, ip, title, iat, deviceId} = sessionData
        const newSession = new SessionClass(userId, exp, ip, title, iat, deviceId)
        await securityRepository.saveSession(newSession)
    }
    async updateSessionData(sessionData: SessionDtoType) {
        await securityRepository.updateSessionData(sessionData)
    }
    async isValidSession(shortSessionData: ShortSessionDtoType): Promise<boolean> {
        return await securityRepository.isValidSession(shortSessionData)
    }
    async newDeviceId(): Promise<string> {
        return String((await securityRepository.maxValueActiveDeviceId()) + 1);
    }
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        return await securityRepository.deleteSessions(userId, deviceId)
    }
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const foundUserId = await securityRepository.findUserIdByDeviceId(deviceId)
        if (!foundUserId) return 404
        if (foundUserId.userId !== userId) return 403
        return await securityRepository.deleteSessionByDeviceId(userId, deviceId)
    }
    async deleteAll() {
        await securityRepository.deleteAll()
    }
}

export const securityService = new SecurityService()