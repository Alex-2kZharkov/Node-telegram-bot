import { Column, Entity } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { RoleCodes } from "../utils/shared.types";

@Entity('roles')
export class RoleEntity extends AppBaseEntity {
  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @Column('enum', { enum: RoleCodes, default: RoleCodes.ANONYME })
  code: RoleCodes;
}
