import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import { GREETING } from "../../utils/constants";
import { CatalogRepository } from "../../repositories";
import { Catalog } from "../interfaces";

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

  async getCatalogsNames(): Promise<Catalog[]> {
    const catalogs = await this.catalogRepo.find();
    return catalogs.map(({ name, description }) => ({
      name,
      description,
    }));
  }
}
