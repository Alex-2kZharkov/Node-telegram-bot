import { Module } from "@nestjs/common";
import { SharedModule } from "../../shared/shared.module";
import { TelegramService } from "./telegram.service";
import { TelegramUpdate } from "./telegram.update";
import { MailService } from "../../shared/services/mail.service";

@Module({
  imports: [SharedModule],
  providers: [TelegramService, TelegramUpdate, MailService],
})
export class TelegramModule {}
