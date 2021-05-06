import { Command, Ctx, Message, On, Start, Update } from "nestjs-telegraf";
import { TelegramService } from "./telegram.service";
import { Context } from "../interfaces";
import { formCatalogString } from "../../utils/helpers";

@Update()
export class TelegramUpdate {
  constructor(private telegramService: TelegramService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const greetings = this.telegramService.getGreetings();
    await ctx.reply(greetings);
  }

  @Command('new_order')
  async showCategories(@Ctx() ctx: Context) {
    const catalogs = await this.telegramService.getCatalogsNames();
    const catalogsString = formCatalogString(catalogs);

    await ctx.reply(catalogsString, { parse_mode: 'HTML' });
  }

  @On('message')
  async showCategoryItems(@Message('text') message: string, @Ctx() ctx: Context) {
    const result = await this.telegramService.handleTextMessage(ctx, message);
    await ctx.reply(result, { parse_mode: 'HTML' });
  }
}
