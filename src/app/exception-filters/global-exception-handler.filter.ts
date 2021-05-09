import { ArgumentsHost, Catch, ExceptionFilter, Inject, Logger, LoggerService } from "@nestjs/common";
import { TelegrafArgumentsHost, TelegrafException } from "nestjs-telegraf";
import { Context } from "../modules/interfaces";

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(Logger)
    private logger: LoggerService,
  ) {}
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();
    this.logger.error(exception);

    if (exception instanceof TelegrafException) {
      await ctx.reply(exception.message);
    }
  }
}
