import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1783307995221 implements MigrationInterface {
    name = 'Initial1783307995221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenant" ("id" SERIAL NOT NULL, "schemaName" character varying(63) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99453a3d44a37cb72e9fc4e31e3" UNIQUE ("schemaName"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissao" ("id" SERIAL NOT NULL, "chave" character varying(80) NOT NULL, "descricao" character varying(160) NOT NULL, CONSTRAINT "UQ_45f26998f57112672b02dcb5d97" UNIQUE ("chave"), CONSTRAINT "PK_28ff4b3ae798fa9f16f6665d68d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "papel" ("id" SERIAL NOT NULL, "nome" character varying(60) NOT NULL, "tenantId" integer NOT NULL, CONSTRAINT "PK_06729b95bd8b347f808aad78335" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "email" character varying(160) NOT NULL, "senhaHash" character varying(255) NOT NULL, "tenantId" integer NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "usuarioId" integer NOT NULL, "tokenHash" character varying(255) NOT NULL, "expiraEm" TIMESTAMP NOT NULL, "revogadoEm" TIMESTAMP, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "papel_permissao" ("papelId" integer NOT NULL, "permissaoId" integer NOT NULL, CONSTRAINT "PK_70105b3b8a657d240512b3d5156" PRIMARY KEY ("papelId", "permissaoId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3101c161af5148ff20bc994d2" ON "papel_permissao" ("papelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b0babb3871a96335ee04749fc2" ON "papel_permissao" ("permissaoId") `);
        await queryRunner.query(`CREATE TABLE "usuario_papel" ("usuarioId" integer NOT NULL, "papelId" integer NOT NULL, CONSTRAINT "PK_f9217bd3e955aaaff54c363d6d8" PRIMARY KEY ("usuarioId", "papelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_091ada48a681d2db23d10e1726" ON "usuario_papel" ("usuarioId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33306c0217acb32b6e55b37aa8" ON "usuario_papel" ("papelId") `);
        await queryRunner.query(`ALTER TABLE "papel_permissao" ADD CONSTRAINT "FK_b3101c161af5148ff20bc994d2b" FOREIGN KEY ("papelId") REFERENCES "papel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "papel_permissao" ADD CONSTRAINT "FK_b0babb3871a96335ee04749fc22" FOREIGN KEY ("permissaoId") REFERENCES "permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuario_papel" ADD CONSTRAINT "FK_091ada48a681d2db23d10e17268" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuario_papel" ADD CONSTRAINT "FK_33306c0217acb32b6e55b37aa8b" FOREIGN KEY ("papelId") REFERENCES "papel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario_papel" DROP CONSTRAINT "FK_33306c0217acb32b6e55b37aa8b"`);
        await queryRunner.query(`ALTER TABLE "usuario_papel" DROP CONSTRAINT "FK_091ada48a681d2db23d10e17268"`);
        await queryRunner.query(`ALTER TABLE "papel_permissao" DROP CONSTRAINT "FK_b0babb3871a96335ee04749fc22"`);
        await queryRunner.query(`ALTER TABLE "papel_permissao" DROP CONSTRAINT "FK_b3101c161af5148ff20bc994d2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33306c0217acb32b6e55b37aa8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_091ada48a681d2db23d10e1726"`);
        await queryRunner.query(`DROP TABLE "usuario_papel"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0babb3871a96335ee04749fc2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3101c161af5148ff20bc994d2"`);
        await queryRunner.query(`DROP TABLE "papel_permissao"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "papel"`);
        await queryRunner.query(`DROP TABLE "permissao"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
    }

}
