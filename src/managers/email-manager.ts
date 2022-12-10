import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmationMessage(email: string, code: string) {
        const subject = "Confirmation Message from CodevwolF"
        const message = " <h1>Thank for your registration</h1>\n" +
            "       <p>To finish registration please follow the link below:\n" +
            `          <a href='https://https://homeworks-git-homework10-v-wolfy.vercel.app/auth/registration-confirmation?code=${code}'>complete registration</a>\n` +
            "      </p>"
        await emailAdapter.sendEmail(email, subject, message)
    },
    async sendEmailPasswordRecoveryMessage(email: string, code: string) {
        const subject = "Password Recovery Message from CodevwolF"
        const message = "  <h1>Password recovery</h1>\n" +
            "       <p>To finish password recovery please follow the link below:\n" +
            `          <a href='https://homeworks-git-homework10-v-wolfy.vercel.app/auth/password-recovery?recoveryCode=${code}'>recovery password</a>\n` +
            "      </p>"
        await emailAdapter.sendEmail(email, subject, message)
    },
}