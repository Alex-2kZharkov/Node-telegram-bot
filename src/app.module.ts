import { Module } from "@nestjs/common";
import { typeOrmConfig } from "./app/config/database/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegrafModule } from "nestjs-telegraf";
import { config } from "./app/config/app.config";
import { TelegramService } from "./app/modules/bot/telegram.service";
import { TelegramUpdate } from "./app/modules/bot/telegram.update";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TelegrafModule.forRoot({
      token: config.BOT_TOKEN,
    }),
  ],
  providers: [TelegramService, TelegramUpdate],
})
export class AppModule {}
