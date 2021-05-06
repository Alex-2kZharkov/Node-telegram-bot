import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import { CATALOG_SPLITTER, GREETING } from "../../utils/constants";
import { CatalogRepository, StuffRepository } from "../../repositories";
import { Catalog, Context, StuffFields } from "../interfaces";
import { checkParsedMessage, formStuffString, parseMessage } from "../../utils/helpers";
import { StuffEntity } from "../../entities";

@Injectable()
export class TelegramService {
  constructor(
    private catalogRepo: CatalogRepository,
    private stuffRepo: StuffRepository,
  ) {}
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

  async handleTextMessage(ctx: Context, message: string): Promise<string> {
    const parsedMessage = parseMessage(message, CATALOG_SPLITTER);
    const searchResult = checkParsedMessage(parsedMessage);
    const catalogStuff = await this.getStuff(searchResult);
    const updatedCatalog = this.countCostPerItem(catalogStuff);
    const str = formStuffString(updatedCatalog);
    return str || searchResult;
  }

  async getStuff(catalog: string): Promise<StuffEntity[]> {
    return await this.stuffRepo
      .createQueryBuilder('stuff')
      .select(['stuff.id', 'stuff.name', 'stuff.amount', 'stuff.quantity'])
      .leftJoin('stuff.catalog', 'catalog')
      .where('catalog.name ILIKE :catalog', { catalog })
      .getMany();
  }

  countCostPerItem(stuff: StuffEntity[]): StuffFields[] {
    return stuff.map((x) => ({
      id: x.id,
      name: x.name,
      amount: x.amount / x.quantity,
    }));
  }
}
