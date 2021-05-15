import { Module } from "@nestjs/common";
import { SharedModule } from "../../shared/shared.module";
import { TelegramService } from "./telegram.service";
import { TelegramUpdate } from "./telegram.update";
import { MailService } from "../../shared/services/mail.service";
import { AuthService } from "../../shared/services/auth.service";

@Module({
  imports: [SharedModule],
  providers: [TelegramService, TelegramUpdate, MailService, AuthService],
})
export class TelegramModule {}
