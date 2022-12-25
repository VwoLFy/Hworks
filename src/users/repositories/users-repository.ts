import {
    UserClass, EmailConfirmationClass
} from "../../main/types/types";
import {UserModel} from "../../main/types/mongoose-schemas-models";
import {ObjectId} from "mongodb";

export class UsersRepository{
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserClass| null> {
        const foundUser = await UserModel.findOne({
            $or: [
                {'accountData.login': loginOrEmail},
                {'accountData.email': loginOrEmail}
            ]
        }).lean()

        if (!foundUser) return null
        return foundUser
    }
    async findUserLoginById(id: string): Promise<string | null> {
        const result = await UserModel.findOne({_id: id})
        if (!result) return null
        return result.accountData.login
    }
    async findEmailConfirmationByCode(confirmationCode: string): Promise<EmailConfirmationClass | null> {
        const result = await UserModel.findOne({'emailConfirmation.confirmationCode': confirmationCode})
        if (!result) return null
        return result.emailConfirmation
    }
    async isFreeLoginAndEmail(login: string, email: string): Promise<boolean> {
        return !(
            await UserModel.findOne({
                $or: [
                    {'accountData.login': {$regex: login, $options: 'i'}},
                    {'accountData.email': {$regex: email, $options: 'i'}}
                ]
            }))
    }
    async createUserAdm(newUser: UserClass): Promise<string> {
        const result = await UserModel.create(newUser)
        return result.id
    }
    async createUser(newUser: UserClass): Promise<ObjectId> {
        const result = await UserModel.create(newUser)
        return result._id
    }
    async updateConfirmation(confirmationCode: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {'emailConfirmation.confirmationCode': confirmationCode},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return result.modifiedCount === 1
    }
    async updateEmailConfirmation(user: UserClass) {
        await UserModel.updateOne(
            {_id: user._id},
            {
                $set: {
                    'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode,
                    'emailConfirmation.expirationDate': user.emailConfirmation.expirationDate
                }
            }
        )
    }
    async updatePassword(email: string, passwordHash: string) {
        await UserModel.updateOne({'accountData.email': email}, {'accountData.passwordHash': passwordHash})
    }
    async deleteUser(_id: ObjectId): Promise<boolean> {
        const result = await UserModel.deleteOne({_id})
        return result.deletedCount !== 0;
    }
    async deleteAll() {
        await UserModel.deleteMany({})
    }
}