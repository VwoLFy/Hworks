import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmationMessage(email: string, code: string) {
        const subject = "Confirmation Message from CodevwolF"
        const message = " <h1>Thank for your registration</h1>\n" +
            "       <p>To finish registration please follow the link below:\n" +
            `          <a href='https://homework7-v.herokuapp.com/auth/registration-confirmation?code=${code}'>complete registration</a>\n` +
            "      </p>"
        await emailAdapter.sendEmail(email, subject, message)
    },
}