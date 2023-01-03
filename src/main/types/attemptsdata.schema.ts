import {Model, model, Schema} from "mongoose";
import add from "date-fns/add";

export interface AttemptsDto {
    ip: string
    url: string
    date: Date
}
interface IAttemptsData extends Model<AttemptsDto> {
    findAttempts(ip: string, url: string): Promise<number>
    addAttemptToList(ip: string, url: string): Promise<void>
}

const AttemptsDataSchema = new Schema<AttemptsDto, IAttemptsData>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})
AttemptsDataSchema.statics = {
    async findAttempts(ip: string, url: string): Promise<number> {
        const fromDate = +add(new Date(), {seconds: -10})
        let query = AttemptsDataModel.countDocuments()
            .where('ip').equals(ip)
            .where('url').equals(url)
            .where('date').gte(fromDate)
        return query.exec()
    },
    async addAttemptToList(ip: string, url: string): Promise<void> {
        await AttemptsDataModel.create(
            {
                ip,
                url,
                date: new Date()
            }
        )
    }
}

export const AttemptsDataModel = model<AttemptsDto, IAttemptsData>('attempts_data', AttemptsDataSchema)