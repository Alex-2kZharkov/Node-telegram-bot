import { Module } from "@nestjs/common";
import { typeOrmConfig } from "./app/config/database/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegrafModule } from "nestjs-telegraf";
import { config } from "./app/config/app.config";
import { TelegramModule } from "./app/modules/telegram/telegram.module";
import { APP_FILTER } from "@nestjs/core";
import { TelegrafExceptionFilter } from "./app/exception-filters/global-exception-handler.filter";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TelegrafModule.forRoot({
      token: config.BOT_TOKEN,
    }),
    TelegramModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TelegrafExceptionFilter,
    },
  ],
})
export class AppModule {}
