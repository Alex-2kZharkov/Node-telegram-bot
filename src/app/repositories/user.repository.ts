import { EntityRepository, Repository } from "typeorm";
import { RoleEntity, UserEntity } from "../entities";

interface UserCredentials {
  name: string;
  telegramId: string;
  role: RoleEntity;
}
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOrCreate({
    telegramId,
    name,
    role,
  }: UserCredentials): Promise<UserEntity> {
    let user = await this.findOne({ name });
    if (!user) {
      user = this.create({
        telegramId,
        name,
        role,
      });
      await user.save();
    }
    return user;
  }
}
