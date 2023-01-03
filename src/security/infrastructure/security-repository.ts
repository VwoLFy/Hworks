import {SessionDocument, SessionModel} from "../domain/session.schema";
import {injectable} from "inversify";

@injectable()
export class SecurityRepository {
    async findSessionByDeviceId(deviceId: string): Promise<SessionDocument | null> {
        return SessionModel.findOne({deviceId})
    }
    async saveSession(session: SessionDocument): Promise<void> {
        await session.save()
    }
    async maxValueActiveDeviceId(): Promise<number> {
        return (await SessionModel.find()
            .sort({'deviceId': -1})
            .limit(1)
            .lean())
            .reduce((acc, it) => acc > +it.deviceId ? acc : +it.deviceId, 0)
    }
    async deleteSessionsOfUser(userId: string, deviceId: string): Promise<boolean> {
        const deleteFilter = {userId, deviceId: {$ne: deviceId}}
        const result = await SessionModel.deleteMany(deleteFilter)
        return !!result.deletedCount
    }
    async deleteSessionByDeviceId(deviceId: string): Promise<number> {
        const result = await SessionModel.deleteOne({deviceId})
        return result.deletedCount ? 204 : 404
    }
    async deleteAll() {
        await SessionModel.deleteMany({})
    }
}