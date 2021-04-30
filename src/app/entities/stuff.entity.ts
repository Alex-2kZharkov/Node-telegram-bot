import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { CatalogEntity } from "./catalog.entity";
import { OrderEntity } from "./order.entity";

@Entity('stuff')
export class StuffEntity extends AppBaseEntity {
  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @Column('integer', { nullable: false, unique: true })
  quantity: number;

  @Column('integer', { nullable: false, unique: true })
  amount: number;

  @ManyToOne(() => CatalogEntity, (catalog) => catalog.stuff, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  catalog: CatalogEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.stuff)
  orders: OrderEntity[];
}
