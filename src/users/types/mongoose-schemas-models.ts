import {HydratedDocument, Model, model, Schema} from "mongoose";
import {EmailConfirmationClass, UserAccountClass, UserClass} from "./types";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";

interface IUserMethods {
    confirmUser(): void
    updateEmailConfirmation(): void
    updatePassword(passwordHash: string): void
}
interface UserModelType extends Model<UserClass, {}, IUserMethods> {}
export type UserHDType = HydratedDocument<UserClass, IUserMethods>

const UserAccountSchema = new Schema<UserAccountClass>({
    login: {
        type: String, required: true, minlength: 3, maxlength: 30, validate: (val: string) => {
            return val.match("^[a-zA-Z0-9_-]*$")
        }
    },
    passwordHash: {type: String, required: true},
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
    createdAt: {type: String, required: true}
}, {_id: false})
const EmailConfirmationSchema = new Schema<EmailConfirmationClass>({
    isConfirmed: {type: Boolean, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
}, {_id: false})
const UserSchema = new Schema<UserClass, UserModelType, IUserMethods>({
    _id: {type: Schema.Types.ObjectId, required: true},
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})
UserSchema.methods.confirmUser = function (): void {
    this.emailConfirmation.isConfirmed = true
}
UserSchema.methods.updateEmailConfirmation = function (): void {
    this.emailConfirmation.confirmationCode = uuidv4()
    this.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
}
UserSchema.methods.updatePassword = function (passwordHash): void {
    this.accountData.passwordHash = passwordHash
}

export const UserModel = model<UserClass, UserModelType>('users', UserSchema)