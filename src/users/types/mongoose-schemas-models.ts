import {model, Schema} from "mongoose";
import {EmailConfirmationClass, UserAccountClass, UserClass} from "./types";

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
    confirmationCode: {type: String},
    expirationDate: {type: Date, required: true}
}, {_id: false})
const UserSchema = new Schema<UserClass>({
    _id: {type: Schema.Types.ObjectId, required: true},
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})

export const UserModel = model('users', UserSchema)