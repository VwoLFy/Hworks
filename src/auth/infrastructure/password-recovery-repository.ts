import {injectable} from "inversify";
import {PasswordRecovery, PasswordRecoveryDocument, PasswordRecoveryModel} from "../domain/password-recovery.schema";

@injectable()
export class PasswordRecoveryRepository {
    async findPassRecovery(recoveryCode: string): Promise<PasswordRecovery | null> {
        return PasswordRecoveryModel.findOne({recoveryCode}).lean()
    }
    async savePassRecovery(passRecovery: PasswordRecoveryDocument) {
        await passRecovery.save()
    }
    async deletePassRecovery(recoveryCode: string) {
        await PasswordRecoveryModel.deleteOne({recoveryCode})
    }
    async deleteAll(){
        await PasswordRecoveryModel.deleteMany({})
    }
}