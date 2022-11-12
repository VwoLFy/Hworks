import {TypeNewUser} from "../domain/user-service";
import {userCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeUserFromDB = {
    _id: ObjectId
    login: string
    password: string
    email: string
    createdAt: string
};

export const usersRepository = {
    async createUser(newUser: TypeNewUser): Promise<string> {
        const result = await userCollection.insertOne(newUser)
        return result.insertedId.toString()
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount !== 0;
    },
    async getUserByLogin(login: string): Promise<TypeUserFromDB | null> {
        return await userCollection.findOne({login: login})
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}