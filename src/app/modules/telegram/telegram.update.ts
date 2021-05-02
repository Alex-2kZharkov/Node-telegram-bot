import { Command, Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { TelegramService } from "./telegram.service";

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

  @On('text')
  async showCategoryItems(@Ctx() ctx: Context) {
    await ctx.reply("Show me what you've got");
  }
}
