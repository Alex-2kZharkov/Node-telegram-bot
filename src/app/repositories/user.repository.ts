import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../entities";

@EntityRepository(UserEntity)
export class UserfRepository extends Repository<UserEntity> {}