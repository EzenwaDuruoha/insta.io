import {MigrationInterface, QueryRunner} from "typeorm";

export class UserSettingsUserProfile1572304868690 implements MigrationInterface {
    name = 'UserSettingsUserProfile1572304868690'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "gender" character varying NOT NULL, "street" character varying NOT NULL DEFAULT '', "city" character varying NOT NULL DEFAULT '', "state" character varying NOT NULL DEFAULT '', "postcode" character varying NOT NULL DEFAULT '', "country" character varying NOT NULL DEFAULT '', "timezone" character varying NOT NULL DEFAULT 'UTC/GMT', "profile_image" character varying NOT NULL DEFAULT '', "last_update" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_1ec6662219f4605723f1e41b6cb" UNIQUE ("id"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "offers" boolean NOT NULL DEFAULT false, "news" boolean NOT NULL DEFAULT false, "alerts" boolean NOT NULL DEFAULT false, "last_update" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_00f004f5922a0744d174530d639" UNIQUE ("id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_update" TIMESTAMP DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_update"`, undefined);
        await queryRunner.query(`DROP TABLE "user_settings"`, undefined);
        await queryRunner.query(`DROP TABLE "user_profiles"`, undefined);
    }

}
