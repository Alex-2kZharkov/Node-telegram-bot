import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { StuffEntity } from "./stuff.entity";
import { UserEntity } from "./user.entity";

@Entity('orders')
export class OrderEntity extends AppBaseEntity {
  @ManyToOne(() => StuffEntity, (stuff) => stuff.orders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stuff: StuffEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  users: UserEntity;

  @Column('integer', { nullable: true})
  quantity: number;

  @Column('integer', { nullable: true})
  amount: number;
}
