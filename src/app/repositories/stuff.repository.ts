import { EntityRepository, Repository } from "typeorm";
import { StuffEntity } from "../entities";

@EntityRepository(StuffEntity)
export class StuffRepository extends Repository<StuffEntity> {}