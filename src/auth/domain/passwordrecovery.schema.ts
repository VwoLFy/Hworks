import {HydratedDocument, Model, model, Schema} from "mongoose";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class PasswordRecovery {
    recoveryCode: string
    expirationDate: Date

    constructor(public email: string,
    ) {
        this.recoveryCode = uuidv4()
        this.expirationDate = add(new Date(), {hours: 24})
    }
}

interface IPasswordRecoveryModel extends Model<PasswordRecovery> {
    findPassRecovery(recoveryCode: string): Promise<PasswordRecovery | null>
    deletePassRecovery(recoveryCode: string): Promise<void>
}
export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>

const PasswordRecoverySchema = new Schema<PasswordRecovery, IPasswordRecoveryModel>({
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})
PasswordRecoverySchema.statics = {
    async findPassRecovery(recoveryCode: string): Promise<PasswordRecovery | null> {
        return PasswordRecoveryModel.findOne({recoveryCode}).lean()
    },
    async deletePassRecovery(recoveryCode: string): Promise<void> {
        await PasswordRecoveryModel.deleteOne({recoveryCode})
    }
}

export const PasswordRecoveryModel = model<PasswordRecoveryDocument, IPasswordRecoveryModel>('pass_recovery', PasswordRecoverySchema)