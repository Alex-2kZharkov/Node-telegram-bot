import { JwtModuleOptions } from "@nestjs/jwt";

require("dotenv").config();

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST: process.env.HOST || "http://localhost",
  AMO_CRM_HOST: process.env.AMO_CRM_HOST || "http://127.0.0.1:8890",
  ROOT_DIR: process.cwd(),
  STATIC_DIR: `${process.cwd()}/static`,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "super-secret-jwt-key",
  BOT_TOKEN: process.env.BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  TELEGRAM_DEV_CHAT_ID: process.env.TELEGRAM_DEV_CHAT_ID,
  UPLOAD_IMAGES_DIR: "uploads/images",
  BLOG_IMAGES_DIR_NAME: "blogs",
  COMPANY_IMAGES_DIR_NAME: "companies",
  RESUME_IMAGES_DIR_NAME: "resume",
  DADATA_TOKEN: process.env.DADATA_TOKEN,
  SMS_SERVICE_TOKEN: process.env.SMS_SERVICE_TOKEN,
  DSN: process.env.DSN,
  YANDEX_TOKEN: process.env.YANDEX_TOKEN,
  JIVOSITE_BOT_TOKEN: process.env.JIVOSITE_BOT_TOKEN,
  JIVOSITE_BOT_WEBHOOK: process.env.JIVOSITE_BOT_WEBHOOK
};

export const JWT_CONFIG: JwtModuleOptions = {
  secret: config.JWT_SECRET_KEY,
  signOptions: {
    expiresIn: "7d"
  }
};

export const MAILER_CONFIG = {
  transport: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_USER_PASSWORD
    },
    secure: true
  }
};
