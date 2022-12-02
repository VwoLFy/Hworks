import {attemptsDataCollection} from "./db";
import {ObjectId} from "mongodb";

export const attemptsRepository = {

    async findAttemptsListByIp(ip: string): Promise<Array<number>> {
        const foundAttemptsData = await attemptsDataCollection.findOne({ip})
        return foundAttemptsData ? foundAttemptsData.timesAttempt : []
    },
    async updateAttemptsList(ip: string, newAttemptsList: number[]) {
        await attemptsDataCollection.updateOne({ip}, {$set: {timesAttempt: newAttemptsList}})
    },
    async addAttemptToList(ip: string) {
        await attemptsDataCollection.updateOne({ip}, {$push: {timesAttempt: Number(new Date())}})
    },
    async createAttemptsList(ip: string) {
        await attemptsDataCollection.insertOne(
            {
                _id: new ObjectId(),
                ip,
                timesAttempt: [Number(new Date())]
            })
    }
}