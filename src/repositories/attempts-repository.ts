import {attemptsDataCollection} from "./db";
import {ObjectId} from "mongodb";
import add from "date-fns/add";

export const attemptsRepository = {

    async findAttempts(ip: string, url: string): Promise<number> {
        const fromDate = add(new Date(), {seconds: -10})
        return await attemptsDataCollection.count({ip, url, date: {$gte: fromDate}})
    },
    async addAttemptToList(ip: string, url: string) {
        await attemptsDataCollection.insertOne(
            {
                _id: new ObjectId(),
                ip,
                url,
                date: new Date()
            }
        )
    },
    async deleteAll() {
        await attemptsDataCollection.deleteMany({})
    }
}