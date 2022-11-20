import {TypeNewUser} from "../domain/user-service";
import {userCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeUser = {
    id: string
    login: string
    password: string
    email: string
    createdAt: string
    isConfirmed: boolean
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
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TypeUser | null> {
        const result = await userCollection.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ]
        })
        if (!result) return null
        return {
            id: result._id.toString(),
            login: result.login,
            password: result.password,
            email: result.email,
            createdAt: result.createdAt,
            isConfirmed: result.isConfirmed
        }
    },
    async findUserLoginById(id: string): Promise<string | null> {
        const result = await userCollection.findOne({_id: new ObjectId(id)})
        if (!result) return null
        return result.login
    },
    async findConfirmById(id: string): Promise<boolean> {
        const user = await userCollection.findOne({_id: new ObjectId(id)})

        return user ? user.isConfirmed : true
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
    async updateConfirmation(id: string) {
        const result = await userCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {isConfirmed: true}}
        )
        return result.modifiedCount === 1
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}