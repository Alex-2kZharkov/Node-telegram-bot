import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { RoleEntity } from "./role.entity";
import { OrderEntity } from "./order.entity";

@Entity("users")
export class UserEntity extends AppBaseEntity {
  @Column("varchar", { nullable: false, unique: true })
  telegramId: string;

  @Column("varchar", { nullable: false, unique: true })
  name: string;

  @Column("varchar", { nullable: true })
  email: string;

  @ManyToOne(
    () => RoleEntity,

    { eager: true, nullable: false }
  )
  @JoinColumn()
  role: RoleEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.users)
  orders: OrderEntity[];
}
