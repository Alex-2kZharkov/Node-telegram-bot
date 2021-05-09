import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../app/utils/constants";

require('dotenv').config();

export class ChangingPasswordOfAdmin1620544013471
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [admin] = await queryRunner.query(
      `SELECT id FROM roles WHERE code = 'ADMIN'`,
    );
    const { id } = admin;

    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, SALT_ROUNDS);

    await queryRunner.query(
      `UPDATE users SET password = '${hash}' WHERE "roleId"='${id}';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE users SET password = NULL`);
  }
}
