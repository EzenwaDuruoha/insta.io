import {MigrationInterface, QueryRunner} from "typeorm";

export class User1572297913518 implements MigrationInterface {
    name = 'User1572297913518'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying(255) NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "confirmed_on" TIMESTAMP, "last_access" TIMESTAMP, "deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "users"`, undefined);
    }

}
