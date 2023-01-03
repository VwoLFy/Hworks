import {ObjectId} from "mongodb";
import {UserHDType, UserModel} from "../domain/user.schema";
import {injectable} from "inversify";

@injectable()
export class UsersRepository{
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserHDType| null> {
        const foundUser = await UserModel.findOne({
            $or: [
                {'accountData.login': {$regex: loginOrEmail, $options: 'i'}},
                {'accountData.email': {$regex: loginOrEmail, $options: 'i'}}
            ]
        })
        return foundUser ? foundUser : null
    }
    async findUserLoginById(id: string): Promise<string | null> {
        const result = await UserModel.findOne({_id: id})
        if (!result) return null
        return result.accountData.login
    }
    async findUserByConfirmationCode(confirmationCode: string): Promise<UserHDType | null> {
        return UserModel.findOne({'emailConfirmation.confirmationCode': confirmationCode})
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
    async saveUser(user: UserHDType): Promise<void> {
        await user.save()
    }
    async deleteUser(_id: ObjectId): Promise<boolean> {
        const result = await UserModel.deleteOne({_id})
        return result.deletedCount !== 0;
    }
    async deleteAll() {
        await UserModel.deleteMany({})
    }
}