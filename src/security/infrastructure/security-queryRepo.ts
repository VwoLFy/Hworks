import {Session, SessionModel} from "../domain/session.schema";
import {injectable} from "inversify";
import {DeviceViewModel} from "../api/models/DeviceViewModel";

@injectable()
export class SecurityQueryRepo {
    async findUserSessions(userId: string): Promise<DeviceViewModel[]> {
        return (await SessionModel.find({userId}).lean()).map(s => this.getOutputModel(s))
    }
    getOutputModel(session: Session): DeviceViewModel {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: new Date(session.iat*1000).toISOString(),
            deviceId: session.deviceId
        }
    }
}