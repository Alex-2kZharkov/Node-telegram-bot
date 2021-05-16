import { Injectable } from "@nestjs/common";
import { RoleCodes } from "../../utils/shared.types";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../../repositories";

@Injectable()
export class AuthService {
  constructor(private userRepo: UserRepository) {}
  async isAdmin(id: string): Promise<boolean> {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
    const admins = users.filter((x) => x.role.code === RoleCodes.ADMIN);
    let isAdmin = false;

    for (const admin of admins) {
      isAdmin = await bcrypt.compare(id, admin.telegramId);
      if (isAdmin) {
        return isAdmin;
      }
    }
    return isAdmin;
  }
}
