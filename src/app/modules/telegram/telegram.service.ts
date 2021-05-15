import { Injectable } from "@nestjs/common";
import { commands } from "../../config/telegram/telegram.config";
import {
  CANCEL_ORDER_PREFIX,
  CATALOG_PREFIX,
  CONFIRM_ORDER_SPLITTER,
  DEFAULT_MESSAGE,
  NEW_ORDER_PREFIX,
  ORDER_UPDATED_MESSAGE,
  ORDERS_MESSAGE,
  SALT_ROUNDS,
  SPLITTER
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
  formConfirmedOrderString,
  formGreetings,
  formNotEnoughStuff,
  formOrderOptions,
  formStuffString,
  getDeliverOrderString,
  parseMessage
} from "../../utils/helpers";
import { OrderEntity, StuffEntity } from "../../entities";
import { OrderFields, OrderStatuses, RoleCodes, SortDirection } from "../../utils/shared.types";
import { MailService } from "../../shared/services/mail.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class TelegramService {
  constructor(
    private catalogRepo: CatalogRepository,
    private stuffRepo: StuffRepository,
    private orderRepo: OrderRepository,
    private userRepo: UserRepository,
    private roleRepo: RoleRepository,
    private mailService: MailService,
  ) {}

  async getGreetings(ctx: Context): Promise<string> {
    const { id } = ctx.from;
    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
    const admins = users.filter((x) => x.role.code === RoleCodes.ADMIN);
    let isAdmin = false;

    for (const admin of admins) {
      isAdmin = await bcrypt.compare(id.toString(), admin.telegramId);
      if (isAdmin) {
        break;
      }
    }

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
    if (message.includes(CATALOG_PREFIX)) {
      return this.handleCatalogMessage(message);
    }

    if (message.includes(NEW_ORDER_PREFIX)) {
      return this.handleNewOrder(ctx, message);
    }

    if (message.includes(CANCEL_ORDER_PREFIX)) {
      return this.cancelOrder(message);
    }

    if (message.includes(CONFIRM_ORDER_SPLITTER)) {
      return this.confirmOrder(message);
    }

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.users', 'users')
      .leftJoinAndSelect('order.users', 'user')
      .leftJoinAndSelect('order.stuff', 'stuff')
      .leftJoinAndSelect('stuff.catalog', 'catalog')
      .getMany();

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

    return DEFAULT_MESSAGE;
  }

  async handleCatalogMessage(message: string): Promise<string> {
    const [, parsedMessage] = parseMessage(message, SPLITTER);
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
    const [orderId, strQuantity] = parseMessage(
      message,
      CONFIRM_ORDER_SPLITTER,
    );
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
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .select([
        'order.id',
        'order.status',
        'order.createdAt',
        'user.name',
        'catalog.name',
        'stuff.name',
        'order.quantity',
        'order.amount',
        'stuff.quantity',
        'stuff.amount',
      ])
      .leftJoin('order.users', 'user')
      .leftJoin('order.stuff', 'stuff')
      .leftJoin('stuff.catalog', 'catalog')
      .where(`order.status = :status`, { status: OrderStatuses.CONFIRMED })
      .orderBy('order.createdAt', SortDirection.DESC)
      .getMany();

    return this.mailService.getOrdersString(orders, ORDERS_MESSAGE);
  }

  async deliverOrder(orderId: string): Promise<string> {
    const order = await this.orderRepo.findOne(orderId);
    order.status = OrderStatuses.DELIVERED;
    await this.orderRepo.update(orderId, order);
    return getDeliverOrderString(orderId);
  }
}
