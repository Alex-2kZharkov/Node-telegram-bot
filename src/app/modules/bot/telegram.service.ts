import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import { GREETING } from "../../utils/constants";

@Injectable()
export class TelegramService {
  getGreetings(): string {
    return commands.reduce(
      (acc, item, idx) => (acc += `${idx + 1}. ${item.command} - ${item.description}\n`),
      GREETING,
    );
  }


}
