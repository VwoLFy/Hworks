import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {AttemptsDataModel} from "../types/mongoose-schemas-models";

export const attemptsRepository = {

    async findAttempts(ip: string, url: string): Promise<number> {
        const fromDate = add(new Date(), {seconds: -10})
        return await AttemptsDataModel.count({ip, url, date: {$gte: fromDate}})
    },
    async addAttemptToList(ip: string, url: string) {
        await AttemptsDataModel.insertMany(
            {
                _id: new ObjectId(),
                ip,
                url,
                date: new Date()
            }
        )
    },
    async deleteAll() {
        await AttemptsDataModel.deleteMany({})
    }
}