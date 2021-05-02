import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import { GREETING } from "../../utils/constants";
import { CatalogRepository } from "../../repositories";

@Injectable()
export class TelegramService {
  constructor(private catalogRepo: CatalogRepository) {}
  getGreetings(): string {
    return commands.reduce(
      (acc, item, idx) =>
        (acc += `${idx + 1}. ${item.command} - ${item.description}\n`),
      GREETING,
    );
  }

  async getCatalogs(): Promise<string> {
    const catalogs = await this.catalogRepo.find();
    return catalogs.reduce(
      (acc, item) => (acc += `● ${item.name} - ${item.description}\n`),
      '<b>Pick one of the catalog:</b>\n',
    );
  }
}
