// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST: process.env.HOST || 'http://localhost',
  BOT_TOKEN: process.env.BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};

// export const MAILER_CONFIG = {
//   transport: {
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     auth: {
//       user: process.env.SMTP_USER_NAME,
//       pass: process.env.SMTP_USER_PASSWORD,
//     },
//     secure: true,
//   },
