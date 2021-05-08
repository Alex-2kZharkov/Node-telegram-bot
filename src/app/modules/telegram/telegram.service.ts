import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import { CATALOG_PREFIX, DEFAULT_MESSAGE, GREETING, NEW_ORDER_PREFIX, SPLITTER } from "../../utils/constants";
import {
  CatalogRepository,
  OrderRepository,
  RoleRepository,
  StuffRepository,
  UserfRepository
} from "../../repositories";
import { Catalog, Context, StuffFields } from "../interfaces";
import { formOrderOptions, formStuffString, parseMessage } from "../../utils/helpers";
import { StuffEntity } from "../../entities";
import { RoleCodes } from "../../utils/shared.types";

@Injectable()
export class TelegramService {
  constructor(
    private catalogRepo: CatalogRepository,
    private stuffRepo: StuffRepository,
    private orderRepo: OrderRepository,
    private userRepo: UserfRepository,
    private roleRepo: RoleRepository,
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
    if (message.includes(CATALOG_PREFIX)) {
      return this.handleCatalogMessage(message);
    }

    if (message.includes(NEW_ORDER_PREFIX)) {
      return this.handleNewOrder(ctx, message);
    }
    return DEFAULT_MESSAGE;
  }

  async handleCatalogMessage(message: string): Promise<string> {
    const [parsedMessage] = parseMessage(message, SPLITTER);
    const catalogStuff = await this.getStuff(parsedMessage);
    const updatedCatalog = this.countCostPerItem(catalogStuff);
    return formStuffString(updatedCatalog);
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

  async handleNewOrder(ctx: Context, message: string): Promise<string> {
    const [, stuffId] = parseMessage(message, NEW_ORDER_PREFIX);
    const { id, first_name, last_name } = ctx.from;
    const stuff = await this.stuffRepo.findOne(stuffId);
    const role = await this.roleRepo.findOne({ code: RoleCodes.CUSTOMER });

    console.log(ctx, id, first_name, last_name);
    console.log('##################', stuffId);
    const user = this.userRepo.create({
      telegramId: id.toString(),
      name: `${first_name} ${last_name}`,
      role,
    });

    const order = this.orderRepo.create({
      stuff,
      users: user,
    });
    await user.save();
    await order.save();

    return formOrderOptions(order.id);
  }
}
