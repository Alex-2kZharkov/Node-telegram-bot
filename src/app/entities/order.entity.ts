import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { StuffEntity } from "./stuff.entity";
import { UserEntity } from "./user.entity";
import { OrderStatuses } from "../utils/shared.types";

@Entity('orders')
export class OrderEntity extends AppBaseEntity {
  @ManyToOne(() => StuffEntity, (stuff) => stuff.orders, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn()
  stuff: StuffEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn()
  users: UserEntity;

  @Column('integer', { nullable: true })
  quantity: number;

  @Column('integer', { nullable: true })
  amount: number;

  @Column('enum', {
    enum: OrderStatuses,
    nullable: false,
    default: OrderStatuses.UNCONFIRMED,
  })
  status: OrderStatuses;
}
