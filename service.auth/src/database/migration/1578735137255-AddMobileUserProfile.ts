import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMobileUserProfile1578735137255 implements MigrationInterface {
    name = 'AddMobileUserProfile1578735137255'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "mobile" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-10 20:51:21.364834'`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-10 20:51:21.364834'`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "mobile"`, undefined);
    }

}
