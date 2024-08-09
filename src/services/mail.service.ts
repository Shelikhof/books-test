import { log } from "console";
import nodemailer from "nodemailer";

class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendActivationMail(email: string, link: string) {
    await this.transporter.sendMail(
      {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Account activation",
        text: `Для активации перейдите по ссылке: ${link}`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
    );
  }
}

export default new MailService();
