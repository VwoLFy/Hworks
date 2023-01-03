import {HydratedDocument, Model, model, Schema} from "mongoose";
import {SessionDto} from "../application/dto/SessionDto";
import {ObjectId} from "mongodb";

export class Session {
    _id: ObjectId

    constructor(public userId: string,
                public exp: number,
                public ip: string,
                public title: string,
                public iat: number,
                public deviceId: string) {
        this._id = new ObjectId()
    }

    updateSessionData(dto: SessionDto) {
        this.ip = dto.ip
        this.title = dto.title
        this.exp = dto.exp
        this.iat = dto.iat
    }
}

interface ISessionModel extends Model<Session> {}
export type SessionDocument = HydratedDocument<Session>

const SessionSchema = new Schema<Session, ISessionModel>({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
SessionSchema.methods = {
    updateSessionData: Session.prototype.updateSessionData
}

export const SessionModel = model<SessionDocument, ISessionModel>('sessions', SessionSchema)