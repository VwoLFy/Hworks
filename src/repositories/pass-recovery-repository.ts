import {PasswordRecoveryModel} from "../types/mongoose-schemas-models";
import {PasswordRecoveryType} from "../types/types";

class PassRecoveryRepository {
    async findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryType | null> {
        return PasswordRecoveryModel.findOne({recoveryCode}).lean()
    }
    async deletePassRecovery(recoveryCode: string) {
        await PasswordRecoveryModel.deleteOne({recoveryCode})
    }
    async deleteAll() {
        await PasswordRecoveryModel.deleteMany({})
    }
}

export const passRecoveryRepository = new PassRecoveryRepository()