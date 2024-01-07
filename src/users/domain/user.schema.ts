import {HydratedDocument, model, Schema} from "mongoose";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";

export class AccountData {
    createdAt: string

    constructor(public login: string,
                public passwordHash: string,
                public email: string) {
        this.createdAt = new Date().toISOString()
    }
}
export class EmailConfirmation {
    confirmationCode: string
    expirationDate: Date

    constructor(public isConfirmed: boolean) {
        this.confirmationCode = uuidv4()
        this.expirationDate = add(new Date(), {hours: 1})
    }
}

export class User {
    public _id: ObjectId
    public accountData: AccountData
    public emailConfirmation: EmailConfirmation

    constructor(login: string,
                passwordHash: string,
                email: string,
                isConfirmed: boolean) {
        this._id = new ObjectId()
        this.accountData = new AccountData(login, passwordHash, email)
        this.emailConfirmation = new EmailConfirmation(isConfirmed)
    }

    confirmUser() {
        this.emailConfirmation.isConfirmed = true
    }
    updateEmailConfirmation() {
        this.emailConfirmation.confirmationCode = uuidv4()
        this.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
    }
    updatePassword(passwordHash: string) {
        this.accountData.passwordHash = passwordHash
    }
}

export type UserDocument = HydratedDocument<User>


const UserAccountSchema = new Schema<AccountData>({
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

const EmailConfirmationSchema = new Schema<EmailConfirmation>({
    isConfirmed: {type: Boolean, required: true},
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
}, {_id: false})

const UserSchema = new Schema<User>({
    _id: {type: Schema.Types.ObjectId, required: true},
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})
UserSchema.methods = {
    confirmUser: User.prototype.confirmUser,
    updateEmailConfirmation: User.prototype.updateEmailConfirmation,
    updatePassword: User.prototype.updatePassword
}

export const UserModel = model<UserDocument>('users', UserSchema)