import {Model, model, Schema} from "mongoose";
import {PasswordRecoveryClass} from "./types";

export interface PasswordRecoveryModelType extends Model<PasswordRecoveryClass> {
    findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryClass | null>
    deletePassRecovery(recoveryCode: string): Promise<void>
}

export const PasswordRecoverySchema = new Schema<PasswordRecoveryClass>({
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})
PasswordRecoverySchema.statics.findPassRecovery = async function (recoveryCode: string): Promise<PasswordRecoveryClass | null> {
    return PasswordRecoveryModel.findOne({recoveryCode}).lean()
}
PasswordRecoverySchema.statics.deletePassRecovery = async function (recoveryCode: string): Promise<void> {
    await PasswordRecoveryModel.deleteOne({recoveryCode})
}

export const PasswordRecoveryModel = model<PasswordRecoveryClass, PasswordRecoveryModelType>('pass_recovery', PasswordRecoverySchema)