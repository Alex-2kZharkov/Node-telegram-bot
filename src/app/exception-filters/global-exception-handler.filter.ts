import { ArgumentsHost, Catch, ExceptionFilter, Inject, Logger, LoggerService } from "@nestjs/common";
import { TelegrafArgumentsHost } from "nestjs-telegraf";
import { Scenes } from "telegraf";

interface Context extends Scenes.SceneContext {}

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
  }
}
