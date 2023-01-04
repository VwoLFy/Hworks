import {HydratedDocument, model, Schema} from "mongoose";

export class AttemptsData {
    date: Date

    constructor(public ip: string,
                public url: string) {
        this.date = new Date()
    }
}
export type AttemptsDataDocument = HydratedDocument<AttemptsData>

const AttemptsDataSchema = new Schema<AttemptsData>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})

export const AttemptsDataModel = model<AttemptsDataDocument>('attempts_data', AttemptsDataSchema)