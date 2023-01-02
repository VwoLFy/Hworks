import {RefreshTokenDataType} from "../../auth/application/jwt-service";
import {ObjectId} from "mongodb";

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

export type SessionDTO = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}
export type ShortSessionDTO = RefreshTokenDataType