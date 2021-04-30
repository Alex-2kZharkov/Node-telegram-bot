import { OrderEntity } from "../entities";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
