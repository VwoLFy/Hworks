import {model, Schema} from "mongoose";
import {SessionClass} from "./types";

const SessionSchema = new Schema<SessionClass>({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
export const SessionModel = model('sessions', SessionSchema)