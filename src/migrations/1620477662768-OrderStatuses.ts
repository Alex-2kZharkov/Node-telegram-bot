import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderStatuses1620477662768 implements MigrationInterface {
    name = 'OrderStatuses1620477662768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM('UNCONFIRMED', 'CANCELLED', 'CONFIRMED', 'DELIVERED')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" "orders_status_enum" NOT NULL DEFAULT 'UNCONFIRMED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "orders_status_enum"`);
    }

}
