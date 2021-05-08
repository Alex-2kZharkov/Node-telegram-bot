// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as nodemailer from "nodemailer";

require('dotenv').config();

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST: process.env.HOST || 'http://localhost',
  BOT_TOKEN: process.env.BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  MAIL_SENDER: process.env.MAIL_SENDER,
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_USER_PASSWORD,
  },
});
