import {TypeEmailConfirmation, TypeUser, TypeUserAccount, TypeUserWithId} from "../types/types";
import {UserModel} from "../types/mongoose-schemas-models";

export const usersRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<TypeUserWithId| null> {
        const result = await UserModel.findOne({
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
        const result = await UserModel.findOne({_id: id})
        if (!result) return null
        return result.accountData.login
    },
    async findEmailConfirmationByCode(confirmationCode: string): Promise<TypeEmailConfirmation | null> {
        const result = await UserModel.findOne({'emailConfirmation.confirmationCode': confirmationCode})
        if (!result) return null
        return result.emailConfirmation
    },
    async isFreeLoginAndEmail(login: string, email: string): Promise<boolean> {
        return !(
            await UserModel.findOne({
                $or: [
                    {'accountData.login': {$regex: login, $options: 'i'}},
                    {'accountData.email': {$regex: email, $options: 'i'}}
                ]
            }))
    },
    async createUserAdm(newUser: TypeUserAccount): Promise<string> {
        const user: TypeUser = {
            accountData: newUser,
            emailConfirmation: {
                isConfirmed: true,
                expirationDate: new Date(newUser.createdAt),
                confirmationCode: ''
            }
        }
        const result = await UserModel.create(user)
        return result.id
    },
    async createUser(newUser: TypeUser): Promise<string> {
        const result = await UserModel.create(newUser)
        return result.id
    },
    async updateConfirmation(confirmationCode: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {'emailConfirmation.confirmationCode': confirmationCode},
            {$set: {'emailConfirmation.isConfirmed': true}}
        )
        return result.modifiedCount === 1
    },
    async updateEmailConfirmation(user: TypeUserWithId) {
        await UserModel.updateOne(
            {_id: user.id},
            {
                $set: {
                    'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode,
                    'emailConfirmation.expirationDate': user.emailConfirmation.expirationDate
                }
            }
        )
    },
    async updatePassword(email: string, passwordHash: string) {
        await UserModel.updateOne({'accountData.email': email}, {'accountData.passwordHash': passwordHash})
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({_id: id})
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await UserModel.deleteMany({})
    },
}