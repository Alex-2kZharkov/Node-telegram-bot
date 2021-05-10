import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafException, TelegrafExecutionContext } from "nestjs-telegraf";
import { Context } from "../../modules/interfaces";
import { RoleEntity, UserEntity } from "../../entities";
import { RoleCodes } from "../../utils/shared.types";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ADMIN_IDS = await this.getAdminIds();

    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    for (const id of ADMIN_IDS) {
      const isAdmin = await bcrypt.compare(from.id.toString(), id);

      if (!isAdmin) {
        throw new TelegrafException('Sorry, but you are not admin ⛔️');
      }
    }
    return true;
  }

  async getAdminIds(): Promise<string[]> {
    const adminRole = await RoleEntity.findOne({ code: RoleCodes.ADMIN });
    const admin = await UserEntity.findOne({ role: adminRole });
    return [admin.telegramId];
  }
}
