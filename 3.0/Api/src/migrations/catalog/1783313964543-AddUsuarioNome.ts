import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsuarioNome1783313964543 implements MigrationInterface {
    name = 'AddUsuarioNome1783313964543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "nome" character varying(120) NOT NULL DEFAULT 'Sem nome'`);
        await queryRunner.query(`ALTER TABLE "usuario" ALTER COLUMN "nome" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "nome"`);
    }

}
