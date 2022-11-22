import {userCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeEmailConfirmation, TypeNewUser, TypeUserAccountType} from "../domain/auth-service";

type TypeUser = {
    id: string
    accountData: TypeUserAccountType
    emailConfirmation: TypeEmailConfirmation
}

export const usersRepository = {
    async createUserAdm(newUser: TypeUserAccountType): Promise<string> {
        const user: Omit<TypeUser, 'id'> = {
            accountData: newUser,
            emailConfirmation: {
                isConfirmed: true,
                expirationDate: null,
                confirmationCode: '',
                timeEmailResending: null,
            }
        }
        const result = await userCollection.insertOne(user)
        return result.insertedId.toString()
    },
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
                {'accountData.login': loginOrEmail},
                {'accountData.email': loginOrEmail}
            ]
        })

        if (!result) return null
        return {
            id: result._id.toString(),
            accountData: result.accountData,
            emailConfirmation: result.emailConfirmation
        }
    },
    async findUserLoginById(id: string): Promise<string | null> {
        const result = await userCollection.findOne({_id: new ObjectId(id)})
        if (!result) return null
        return result.accountData.login
    },
    async isFreeLoginAndEmail(login: string, email: string): Promise<boolean> {
        return !(
            await userCollection.findOne({
                $or: [
                    {'accountData.login': {$regex: login, $options: 'i'}},
                    {'accountData.email': {$regex: email, $options: 'i'}}
                ]
            }))
    },
    async updateConfirmation(confirmationCode: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            {'emailConfirmation.confirmationCode': confirmationCode},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return result.modifiedCount === 1
    },
    async findEmailConfirmationByCode(confirmationCode: string): Promise<TypeEmailConfirmation | null> {
        const result = await userCollection.findOne({'emailConfirmation.confirmationCode': confirmationCode})
        if (!result) return null
        return result.emailConfirmation
    },
    async updateEmailConfirmation(user: TypeUser) {
        await userCollection.updateOne(
            {_id: new ObjectId(user.id)},
            {$set: {
                    'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode,
                    'emailConfirmation.timeEmailResending': user.emailConfirmation.timeEmailResending,
                    'emailConfirmation.expirationDate': user.emailConfirmation.expirationDate
                }
            }
        )
    },
    async deleteAll() {
        await userCollection.deleteMany({})
    }
}