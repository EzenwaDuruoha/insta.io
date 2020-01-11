import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCascadeUserProfile1578741670494 implements MigrationInterface {
    name = 'UpdateCascadeUserProfile1578741670494'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-11 09:43:59.529895'`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-11 09:43:59.529895'`, undefined);
    }

}
