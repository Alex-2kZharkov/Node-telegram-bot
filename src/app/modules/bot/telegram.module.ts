import { Module } from "@nestjs/common";
import { SharedModule } from "../../shared/shared.module";
import { TelegramService } from "./telegram.service";
import { TelegramUpdate } from "./telegram.update";

@Module({
  imports: [SharedModule],
  providers: [TelegramService, TelegramUpdate],
})
export class TelegramModule {}
