import {MigrationInterface, QueryRunner} from "typeorm";

export class UserProfileDefaults1574412188455 implements MigrationInterface {
    name = 'UserProfileDefaults1574412188455'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "firstname" SET DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "lastname" SET DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" SET DEFAULT 'male'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "gender" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "lastname" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "firstname" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2019-11-22 08:07:53.540177'`, undefined);
    }

}
