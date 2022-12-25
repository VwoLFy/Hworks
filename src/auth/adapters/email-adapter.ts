import nodemailer from "nodemailer";
import {settings} from "../../main/settings";

export class EmailAdapter{
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: settings.E_MAIL,
                pass: settings.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `CodevwolF <${settings.E_MAIL}>`,
            to: email,
            subject: subject,
            html: message
        });
    }
}