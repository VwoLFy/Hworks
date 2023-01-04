import {HydratedDocument, model, Schema} from "mongoose";
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
export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>

const PasswordRecoverySchema = new Schema<PasswordRecovery>({
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})

export const PasswordRecoveryModel = model<PasswordRecoveryDocument>('pass_recovery', PasswordRecoverySchema)