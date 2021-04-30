import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1619811489121 implements MigrationInterface {
    name = 'InitialMigration1619811489121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "roles_code_enum" AS ENUM('ADMIN', 'CUSTOMER', 'ANONYME')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "code" "roles_code_enum" NOT NULL DEFAULT 'ANONYME', CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "telegramId" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "roleId" uuid NOT NULL, CONSTRAINT "UQ_df18d17f84763558ac84192c754" UNIQUE ("telegramId"), CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "quantity" integer NOT NULL, "amount" integer NOT NULL, "stuffId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "UQ_40ce179e66b3ffb0dc6932a8c90" UNIQUE ("quantity"), CONSTRAINT "UQ_d9646fa67dbabdf6c6aa7e6b2ff" UNIQUE ("amount"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stuff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "quantity" integer NOT NULL, "amount" integer NOT NULL, "catalogId" uuid NOT NULL, CONSTRAINT "UQ_417f153d5e84e431d7a9c1530f9" UNIQUE ("name"), CONSTRAINT "UQ_a80e8e13405bcb539b04fde9ac0" UNIQUE ("quantity"), CONSTRAINT "UQ_1ca457902b6a7ad5d34850ecd4c" UNIQUE ("amount"), CONSTRAINT "PK_c1df5b5c9d1ed32d6684b292254" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_6a643db5f766fcb64f213a20b0c" UNIQUE ("name"), CONSTRAINT "PK_1883399275415ee6107413fe6c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_41e1c2974c13605b7529728a615" FOREIGN KEY ("stuffId") REFERENCES "stuff"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_c6c2785c13b07ddbc4a9792770a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stuff" ADD CONSTRAINT "FK_df10009e0f9f554fcc5ddbba335" FOREIGN KEY ("catalogId") REFERENCES "catalogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stuff" DROP CONSTRAINT "FK_df10009e0f9f554fcc5ddbba335"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_c6c2785c13b07ddbc4a9792770a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_41e1c2974c13605b7529728a615"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`DROP TABLE "catalogs"`);
        await queryRunner.query(`DROP TABLE "stuff"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "roles_code_enum"`);
    }

}
