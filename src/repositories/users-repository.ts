import {TypeNewUser} from "../domain/user-service";
import {userCollection} from "./db";


export const usersRepository = {
    async createUser(newUser: TypeNewUser): Promise<string> {
        const result = await userCollection.insertOne(newUser)
        return result.insertedId.toString()
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({_id: new Object(id)})
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}