import {emailConfirmationCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeEmailConfirmationFromDB = {
    _id: ObjectId
    expirationDate: Date
    confirmationCode: string
    timeEmailResending: Date
    userId: string
};

export const emailConfirmationUserRepository = {
    async createEmailConfirmation(emailConfirmation: Omit<TypeEmailConfirmationFromDB, '_id'>) {
        await emailConfirmationCollection.insertOne(emailConfirmation)
    },
    async deleteEmailConfirmation(userId: string) {
        await emailConfirmationCollection.deleteOne({userId})
    },
    async findEmailConfirmationByCode(confirmationCode: string) {
        const result = await emailConfirmationCollection.findOne({confirmationCode})
        if (!result) return null
        return {
            id: result._id.toString(),
            expirationDate: result.expirationDate,
            confirmationCode: result.confirmationCode,
            timeEmailResending: result.timeEmailResending,
            userId: result.userId,
        }
    },
    async findEmailConfirmationByUserId(userId: string) {
        return await emailConfirmationCollection.findOne({userId})
    },
    async deleteAll() {
        await emailConfirmationCollection.deleteMany({})
    }
}