import {SecurityRepository} from "../infrastructure/security-repository";
import {SessionDto} from "./dto/SessionDto";
import {inject, injectable} from "inversify";
import {Session, SessionModel} from "../domain/session.schema";
import {ShortSessionDto} from "./dto/ShortSessionDto";

@injectable()
export class SecurityService {
    constructor(@inject(SecurityRepository) protected securityRepository: SecurityRepository) {}

    async saveSession(dto: SessionDto): Promise<void> {
        const {userId, exp, ip, title, iat, deviceId} = dto

        const newSession = new Session(userId, exp, ip, title, iat, deviceId)
        const session = new SessionModel(newSession)
        await this.securityRepository.saveSession(session)
    }
    async updateSessionData(dto: SessionDto) {
        const foundSession = await this.securityRepository.findSessionByDeviceId(dto.deviceId)
        if (!foundSession) return

        foundSession.updateSessionData(dto)
        await this.securityRepository.saveSession(foundSession)
    }
    async isValidSession(dto: ShortSessionDto): Promise<boolean> {
        const foundSession = await this.securityRepository.findSessionByDeviceId(dto.deviceId)
        return !(!foundSession || dto.iat !== foundSession.iat || dto.userId !== foundSession.userId)
    }
    async newDeviceId(): Promise<string> {
        return String((await this.securityRepository.maxValueActiveDeviceId()) + 1);
    }
    async deleteSessionsOfUser(userId: string, deviceId: string): Promise<boolean> {
        return await this.securityRepository.deleteSessionsOfUser(userId, deviceId)
    }
    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<number> {
        const foundSession = await this.securityRepository.findSessionByDeviceId(deviceId)
        if (!foundSession) return 404
        if (foundSession.userId !== userId) return 403

        return await this.securityRepository.deleteSessionByDeviceId(deviceId)
    }
    async deleteAll() {
        await this.securityRepository.deleteAll()
    }
}