import nodemailer from "nodemailer";
import * as process from "process";
import { parseAppInt } from "../../helpers/parseAppInt";

class MailService {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseAppInt(process.env.SMTP_PORT),
    secure: true,
    pool: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendActivationMail(toEmail: string, activationLink: string) {
    const encodedLink = encodeURIComponent(activationLink);

    const url = `${process.env.VITE_API_URL}/api/user/activate/${encodedLink}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: "Активация аккаунта на " + process.env.VITE_API_URL,
      html: `
        <div>
          <h1>Для активации аккаунта перейдите по ссылке</h1>
          <a href="${url}">${url}</a>
        </div>
      `,
    });
  }
}

export const mailService = new MailService();
