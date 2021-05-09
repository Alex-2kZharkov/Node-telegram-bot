import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../app/utils/constants";

require('dotenv').config();

export class HashingTelegramId1620556879633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [adminRole] = await queryRunner.query(
          `SELECT id FROM roles WHERE code = 'ADMIN'`,
        );
        const { id } = adminRole;
        const [{telegramId, userId}] = await queryRunner.query(
          `SELECT "telegramId", id as "userId" FROM users WHERE "roleId"='${id}';`,
        )
        const hash = await bcrypt.hash(telegramId, SALT_ROUNDS);

        await queryRunner.query(
          `UPDATE users SET "telegramId" = '${hash}' WHERE id='${userId}';`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const [adminRole] = await queryRunner.query(
          `SELECT id FROM roles WHERE code = 'ADMIN'`,
        );
        const { id } = adminRole;
        await queryRunner.query(
          `UPDATE users SET "telegramId" = '${process.env.ADMIN_TELEGRAM_ID}' WHERE "roleId"='${id}';`,
        );
    }

}
