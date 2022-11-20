import nodemailer from "nodemailer";
import {settings} from "../settings";

export const emailsAdapter = {
    async sendEmailConfirmationMessage(email: string, code: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: settings.E_MAIL, // generated ethereal user
                pass: settings.EMAIL_PASS, // password - отдельный Пароль приложения создан
            },
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: '"CodevwolF" <codevwolf@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Message from CodeVwolF", // Subject line
            html: " <h1>Thank for your registration</h1>\n" +
                "       <p>To finish registration please follow the link below:\n" +
                `          <a href='https://homework7-v.herokuapp.com/auth/registration-confirmation?code=${code}'>complete registration</a>\n` +
                "      </p>", // html body
        });
    }
}