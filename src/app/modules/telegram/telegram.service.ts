import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import {
  AMPERSAND_SPLITTER,
  CANCEL_ORDER_PREFIX,
  CATALOG_PREFIX,
  CATALOG_TITLE,
  DEFAULT_MESSAGE,
  NEW_CATALOG_PREFIX,
  NEW_ORDER_PREFIX,
  NEW_STUFF_PREFIX,
  ORDER_UPDATED_MESSAGE,
  ORDERS_MESSAGE,
  SALT_ROUNDS,
  SEMICOLON_SPLITTER,
  SPLITTER,
  STUFF_MESSAGE
} from "../../utils/constants";
import {
  CatalogRepository,
  OrderRepository,
  RoleRepository,
  StuffRepository,
  UserRepository
} from "../../repositories";
import { Catalog, Context, StuffFields } from "../interfaces";
import {
  formCancelledOrderString,
  formCatalogString,
  formConfirmedOrderString,
  formGreetings,
  formNotEnoughStuff,
  formOrderOptions,
  formStuffString,
  getDeliverOrderString,
  parseMessage
} from "../../utils/helpers";
import { OrderEntity, StuffEntity } from "../../entities";
import { OrderFields, OrderStatuses, RoleCodes } from "../../utils/shared.types";
import { MailService } from "../../shared/services/mail.service";
import * as bcrypt from "bcrypt";
import { AuthService } from "../../shared/services/auth.service";
import { ILike } from "typeorm";

@Injectable()
export class TelegramService {
  constructor(
    private catalogRepo: CatalogRepository,
    private stuffRepo: StuffRepository,
    private orderRepo: OrderRepository,
    private userRepo: UserRepository,
    private roleRepo: RoleRepository,
    private mailService: MailService,
    private authService: AuthService,
  ) {}

  async getGreetings(ctx: Context): Promise<string> {
    const isAdmin = await this.authService.isAdmin(ctx.from.id.toString());
    return isAdmin
      ? formGreetings(commands)
      : formGreetings(
          commands.filter((x) => x.roles.includes(RoleCodes.CUSTOMER)),
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
    const isAdmin = await this.authService.isAdmin(ctx.from.id.toString());

    if (message.includes(CATALOG_PREFIX)) {
      return this.getCatalogsStuff(message);
    }

    if (message.includes(NEW_ORDER_PREFIX)) {
      return this.handleNewOrder(ctx, message);
    }

    if (message.includes(CANCEL_ORDER_PREFIX)) {
      return this.cancelOrder(message);
    }

    if (message.includes(SEMICOLON_SPLITTER)) {
      return this.confirmOrder(message);
    }

    const orders = await this.orderRepo.getOrders();
    const order = orders.find((order) => order.id === message);
    if (order) {
      const resultsMessage = await this.deliverOrder(message);
      ctx.telegram.sendMessage(
        order.users.telegramId,
        this.mailService.getOrdersString([order], ORDER_UPDATED_MESSAGE),
        { parse_mode: 'HTML' },
      );
      return resultsMessage;
    }

    if (isAdmin && message.includes(NEW_CATALOG_PREFIX)) {
      await this.addCatalog(message);
      const catalogs = await this.getCatalogsNames();
      return formCatalogString(catalogs, CATALOG_TITLE);
    }

    if (isAdmin && message.includes(NEW_STUFF_PREFIX)) {
      await this.addStuff(message);
      const catalogs = await this.getCatalogsNames();
      const catalogsNames = catalogs.map((x) => x.name);
      const catalogsStuff = await this.getStuff(catalogsNames);
      const orderedCatalogStuff = catalogsStuff.sort(
        (a, b) => Number(a.createdAt) - Number(b.createdAt),
      );

      return this.mailService.getStuffString(
        orderedCatalogStuff,
        STUFF_MESSAGE,
      );
    }

    return DEFAULT_MESSAGE;
  }

  async getCatalogsStuff(message: string): Promise<string> {
    const [, catalogName] = parseMessage(message, SPLITTER);
    const catalogStuff = await this.getStuff([catalogName]);
    const updatedCatalog = this.countCostPerItem(catalogStuff);

    return formStuffString(updatedCatalog);
  }

  async getStuff(catalogs: string[]): Promise<StuffEntity[]> {
    let stuff = [] as StuffEntity[];

    for (const catalog of catalogs) {
      const gg = await this.stuffRepo
        .createQueryBuilder('stuff')
        .leftJoinAndSelect('stuff.catalog', 'catalog')
        .where('catalog.name ILIKE :catalog', { catalog })
        .getMany();

      stuff = [...stuff, ...gg];
    }

    return stuff;
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
    const hashedId = await bcrypt.hash(id.toString(), SALT_ROUNDS);

    const user = await this.userRepo.findOrCreate({
      telegramId: hashedId,
      name: `${first_name} ${last_name}`,
      role,
    });

    const order = this.orderRepo.create({
      stuff,
      users: user,
    });

    await order.save();

    return formOrderOptions(order.id, order.status);
  }

  async cancelOrder(message: string) {
    const [orderId] = parseMessage(message, CANCEL_ORDER_PREFIX);
    const order = await this.orderRepo.findOne(orderId);
    order.status = OrderStatuses.CANCELLED;
    await order.save();

    return formCancelledOrderString(order.users?.name);
  }

  async confirmOrder(message: string) {
    const [orderId, strQuantity] = parseMessage(message, SEMICOLON_SPLITTER);
    const requiredQuantity = +strQuantity;
    const order = await this.orderRepo.findOne(orderId);
    const { quantity, amount } = order.stuff;

    if (requiredQuantity > order.stuff.quantity) {
      return formNotEnoughStuff(quantity);
    }

    const cost = Math.round((amount / quantity) * requiredQuantity);
    order.stuff.quantity -= requiredQuantity;
    order.stuff.amount -= cost;
    await order.stuff.save();

    order.quantity = requiredQuantity;
    order.amount = cost;
    order.status = OrderStatuses.CONFIRMED;
    await order.save();

    await this.sendNewOrderEmail(order);

    return formConfirmedOrderString(order.users.name, cost);
  }

  async sendNewOrderEmail({
    id,
    createdAt,
    updatedAt,
    users,
    stuff,
    quantity,
    amount,
    status,
  }: OrderEntity): Promise<void> {
    const orderOptions = {
      status,
      id,
      createdAt,
      updatedAt,
      catalog: stuff.catalog.name,
      customerName: users.name,
      stuff: stuff.name,
      orderQuantity: quantity,
      orderAmount: amount,
      stuffQuantity: stuff.quantity,
      stuffAmount: stuff.amount,
    } as OrderFields;

    const messageText = this.mailService.getNewOrderText(orderOptions);
    const adminRole = await this.roleRepo.findOne({ code: RoleCodes.ADMIN });
    const admin = await this.userRepo.findOne({ role: adminRole });
    const email = admin.email;
    await this.mailService.send(email, messageText, 'New order');
  }

  async getOrders(): Promise<string> {
    const orders = await this.orderRepo.getOrders();
    const confirmedOrders = orders
      .filter((x) => x.status === OrderStatuses.CONFIRMED)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    return this.mailService.getOrdersString(confirmedOrders, ORDERS_MESSAGE);
  }

  async deliverOrder(orderId: string): Promise<string> {
    const order = await this.orderRepo.findOne(orderId);
    order.status = OrderStatuses.DELIVERED;
    await this.orderRepo.update(orderId, order);
    return getDeliverOrderString(orderId);
  }

  async addCatalog(message: string): Promise<void> {
    const [, name, description] = parseMessage(message, AMPERSAND_SPLITTER);
    let catalog = await this.catalogRepo.findOne({ name });
    if (!catalog) {
      catalog = this.catalogRepo.create({ name, description });
      await catalog.save();
    }
  }

  async addStuff(message: string): Promise<void> {
    const [, name, quantity, amount, catalogName] = parseMessage(
      message,
      AMPERSAND_SPLITTER,
    );
    const catalog = await this.catalogRepo.findOne({
      name: ILike(`%${catalogName}%`),
    });
    let stuff = await this.stuffRepo.findOne({
      name: ILike(`%${name}%`),
    });

    if (!stuff) {
      stuff = this.stuffRepo.create();
      stuff.name = name;
      stuff.quantity = Number(quantity);
      stuff.amount = Number(amount);
      stuff.catalog = catalog;
      await stuff.save();
    }
  }
}
