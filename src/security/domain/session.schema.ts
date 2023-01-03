import {HydratedDocument, Model, model, Schema} from "mongoose";
import {SessionDTO} from "../application/dto";
import {ObjectId} from "mongodb";

interface ISessionMethods {
    updateSessionData(dto: SessionDTO): void
}

export class SessionClass {
    _id: ObjectId

    constructor(public userId: string,
                public exp: number,
                public ip: string,
                public title: string,
                public iat: number,
                public deviceId: string) {
        this._id = new ObjectId()
    }
}

interface ISessionModel extends Model<SessionClass, {}, ISessionMethods> {}
export type SessionDocument = HydratedDocument<SessionClass, ISessionMethods>

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