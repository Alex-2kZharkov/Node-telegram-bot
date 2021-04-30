import { EntityRepository, Repository } from "typeorm";
import { CatalogEntity } from "../entities";

@EntityRepository(CatalogEntity)
export class CatalogRepository extends Repository<CatalogEntity> {}