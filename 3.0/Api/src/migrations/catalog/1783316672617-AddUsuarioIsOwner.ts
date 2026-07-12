import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuarioIsOwner1783316672617 implements MigrationInterface {
    name = 'AddUsuarioIsOwner1783316672617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "isOwner" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "isOwner"`);
    }

}
