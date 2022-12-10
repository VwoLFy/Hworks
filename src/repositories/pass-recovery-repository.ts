import {PasswordRecoveryModel} from "../types/mongoose-schemas-models";

export const passRecoveryRepository = {
    async findPassRecovery(recoveryCode: string) {
        return PasswordRecoveryModel.findOne({recoveryCode}).exec()
    },
    async deletePassRecovery(recoveryCode: string) {
        await PasswordRecoveryModel.deleteOne({recoveryCode})
    },
    async deleteAll() {
        await PasswordRecoveryModel.deleteMany({})
    }
}