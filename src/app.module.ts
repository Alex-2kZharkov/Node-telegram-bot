import { Module } from "@nestjs/common";
import { typeOrmConfig } from "./app/config/database/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegrafModule } from "nestjs-telegraf";
import { config } from "./app/config/app.config";
import { TelegramModule } from "./app/modules/telegram/telegram.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TelegrafModule.forRoot({
      token: config.BOT_TOKEN,
    }),
    TelegramModule,
  ],
})
export class AppModule {}
