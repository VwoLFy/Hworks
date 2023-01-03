import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class PasswordRecoveryClass {
    recoveryCode: string
    expirationDate: Date

    constructor(public email: string,
    ) {
        this.recoveryCode = uuidv4()
        this.expirationDate = add(new Date(), {hours: 24})
    }
}