import { Command, Ctx, Message, On, Start, Update } from "nestjs-telegraf";
import { TelegramService } from "./telegram.service";
import { Context } from "../interfaces";
import { formCatalogString } from "../../utils/helpers";
import { CANCEL_ORDER_PREFIX, WELCOME_ADMIN_MESSAGE } from "../../utils/constants";
import { UseGuards } from "@nestjs/common";
import { AdminGuard } from "../../shared/guards/admin.guard";

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

  @Command('confirm_order')
  @UseGuards(AdminGuard)
  async confirmCustomerOrder(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(WELCOME_ADMIN_MESSAGE);
  }

  @On('text') // FIXME it was 'message'
  async showCategoryItems(
    @Message('text') message: string,
    @Ctx() ctx: Context,
  ) {
    const result = await this.telegramService.handleTextMessage(ctx, message);
    await ctx.reply(result, { parse_mode: 'HTML' });

    if (message.includes(CANCEL_ORDER_PREFIX)) {
      await this.start(ctx);
    }
  }
}
