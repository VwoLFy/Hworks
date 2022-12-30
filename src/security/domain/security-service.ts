import {SecurityRepository} from "../infrastructure/security-repository";
import {SessionClass, SessionDtoType, ShortSessionDtoType} from "../types/types";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityService {
    constructor(@inject(SecurityRepository) protected securityRepository: SecurityRepository) {}

    async saveSession(sessionData: SessionDtoType): Promise<void> {
        const {userId, exp, ip, title, iat, deviceId} = sessionData
        const newSession = new SessionClass(userId, exp, ip, title, iat, deviceId)
        await this.securityRepository.saveSession(newSession)
    }
    async updateSessionData(sessionData: SessionDtoType) {
        await this.securityRepository.updateSessionData(sessionData)
    }
    async isValidSession(shortSessionData: ShortSessionDtoType): Promise<boolean> {
        return await this.securityRepository.isValidSession(shortSessionData)
    }
    async newDeviceId(): Promise<string> {
        return String((await this.securityRepository.maxValueActiveDeviceId()) + 1);
    }
    async deleteSessions(userId: string, deviceId: string): Promise<boolean> {
        return await this.securityRepository.deleteSessions(userId, deviceId)
    }
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const foundUserId = await this.securityRepository.findUserIdByDeviceId(deviceId)
        if (!foundUserId) return 404
        if (foundUserId.userId !== userId) return 403
        return await this.securityRepository.deleteSessionByDeviceId(userId, deviceId)
    }
    async deleteAll() {
        await this.securityRepository.deleteAll()
    }
}