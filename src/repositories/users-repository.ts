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
    async findUserByLogin(login: string): Promise<TypeUserFromDB | null> {
        return await userCollection.findOne({login: login})
    },
    async findUserByEmail(email: string): Promise<TypeUserFromDB | null> {
        return await userCollection.findOne({email: email})
    },
    async findUserLoginById(id: string): Promise<string | null> {
        const result = await userCollection.findOne({_id: new ObjectId(id)})
        if (!result) return null
        return result.login
    },
    async isFreeLoginAndEmail(login: string, email: string): Promise<boolean> {
        return !(
            await userCollection.findOne({
                $or: [
                    {login: {$regex: login, $options: 'i'}},
                    {email: {$regex: email, $options: 'i'}}
                ]
            }))
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}