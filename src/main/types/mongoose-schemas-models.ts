import {Model, model, Schema} from "mongoose";
import add from "date-fns/add";

export interface AttemptsDtoType {
    ip: string
    url: string
    date: Date
}
export interface AttemptsDataMethodsType {
}
export interface AttemptsDataModelType extends Model<AttemptsDtoType, {}, AttemptsDataMethodsType> {
    findAttempts(ip: string, url: string): Promise<number>

    addAttemptToList(ip: string, url: string): Promise<void>
}

const AttemptsDataSchema = new Schema<AttemptsDtoType, AttemptsDataModelType, AttemptsDataMethodsType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})
AttemptsDataSchema.statics.findAttempts = async function (ip: string, url: string): Promise<number> {
    const fromDate = +add(new Date(), {seconds: -10})
    let query = AttemptsDataModel.countDocuments()
        .where('ip').equals(ip)
        .where('url').equals(url)
        .where('date').gte(fromDate)
    return query.exec()
}
AttemptsDataSchema.statics.addAttemptToList = async function (ip: string, url: string): Promise<void> {
    await AttemptsDataModel.create(
        {
            ip,
            url,
            date: new Date()
        }
    )
}

export const AttemptsDataModel = model<AttemptsDtoType, AttemptsDataModelType>('attempts_data', AttemptsDataSchema)