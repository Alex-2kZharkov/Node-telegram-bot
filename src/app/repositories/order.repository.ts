import { OrderEntity } from "../entities";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async getOrders(): Promise<OrderEntity[]> {
    return await this.createQueryBuilder('order')
      .leftJoinAndSelect('order.users', 'users')
      .leftJoinAndSelect('order.users', 'user')
      .leftJoinAndSelect('order.stuff', 'stuff')
      .leftJoinAndSelect('stuff.catalog', 'catalog')
      .getMany();
  }
}
