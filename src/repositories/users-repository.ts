import {TypeNewUser} from "../domain/user-service";
import {userCollection} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(newUser: TypeNewUser): Promise<string> {
        const result = await userCollection.insertOne(newUser)
        return result.insertedId.toString()
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount !== 0;
    },
    async getPassword(login: string): Promise<string> {
        const user = await userCollection.findOne({login: login})
        if (user) return user.password
        return ''
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}