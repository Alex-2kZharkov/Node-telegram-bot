import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "./app-base-entity";
import { StuffEntity } from "./stuff.entity";

@Entity('catalogs')
export class CatalogEntity extends AppBaseEntity {
  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => StuffEntity, (stuff) => stuff.catalog)
  stuff: StuffEntity[];
}
