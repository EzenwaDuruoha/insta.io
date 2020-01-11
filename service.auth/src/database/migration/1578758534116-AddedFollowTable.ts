import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedFollowTable1578758534116 implements MigrationInterface {
    name = 'AddedFollowTable1578758534116'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unfollowed" boolean NOT NULL DEFAULT false, "last_update" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP DEFAULT now(), "followerId" uuid, "followedId" uuid, CONSTRAINT "UQ_8988f607744e16ff79da3b8a627" UNIQUE ("id"), CONSTRAINT "UQ_9b276f73a492c947f7e5ff297d8" UNIQUE ("followerId", "followedId"), CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT 'now'`, undefined);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_d5ab44405d07cecac582c6448bf" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_d5ab44405d07cecac582c6448bf"`, undefined);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-11 15:42:00.861907'`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "last_access" SET DEFAULT '2020-01-11 15:42:00.861907'`, undefined);
        await queryRunner.query(`DROP TABLE "follows"`, undefined);
    }

}
