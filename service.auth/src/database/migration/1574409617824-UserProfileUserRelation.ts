import {MigrationInterface, QueryRunner} from "typeorm";

export class UserProfileUserRelation1574409617824 implements MigrationInterface {
    name = 'UserProfileUserRelation1574409617824'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "userId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "UQ_8481388d6325e752cd4d7e26c6d" UNIQUE ("userId")`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "userId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "UQ_986a2b6d3c05eb4091bb8066f78" UNIQUE ("userId")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "UQ_1ec6662219f4605723f1e41b6cb" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "UQ_00f004f5922a0744d174530d639" UNIQUE ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "UQ_00f004f5922a0744d174530d639"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "UQ_1ec6662219f4605723f1e41b6cb"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "UQ_986a2b6d3c05eb4091bb8066f78"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "UQ_8481388d6325e752cd4d7e26c6d"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "userId"`, undefined);
    }

}
