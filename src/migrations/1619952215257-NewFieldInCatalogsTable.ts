import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFieldInCatalogsTable1619952215257 implements MigrationInterface {
    name = 'NewFieldInCatalogsTable1619952215257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalogs" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalogs" DROP COLUMN "description"`);
    }

}
