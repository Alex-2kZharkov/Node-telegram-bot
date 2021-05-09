import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordFieldToUsers1620543760472 implements MigrationInterface {
    name = 'AddPasswordFieldToUsers1620543760472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
