import {HydratedDocument, Model, model, Schema} from "mongoose";
import {SessionClass, SessionDTO} from "./types";

interface ISessionMethods {
    updateSessionData(dto: SessionDTO): void
}
interface ISessionModel extends Model<SessionClass, {}, ISessionMethods> {}
export type SessionHDType = HydratedDocument<SessionClass, ISessionMethods>

const SessionSchema = new Schema<SessionClass, ISessionModel, ISessionMethods>({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
SessionSchema.methods.updateSessionData = function (dto) {
        this.ip = dto.ip
        this.title = dto.title
        this.exp = dto.exp
        this.iat = dto.iat
}
export const SessionModel = model<SessionClass, ISessionModel>('sessions', SessionSchema)