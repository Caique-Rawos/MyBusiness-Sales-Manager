import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCrachaRfidControlePonto1790600000000 implements MigrationInterface {
  name = 'AddCrachaRfidControlePonto1790600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cracha_rfid" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "hash" character varying(255) NOT NULL, CONSTRAINT "UQ_cracha_rfid_hash" UNIQUE ("hash"), CONSTRAINT "PK_cracha_rfid_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "controle_ponto" ("id" SERIAL NOT NULL, "id_cracha" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_controle_ponto_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "controle_ponto" ADD CONSTRAINT "FK_controle_ponto_cracha" FOREIGN KEY ("id_cracha") REFERENCES "cracha_rfid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "controle_ponto" DROP CONSTRAINT "FK_controle_ponto_cracha"`);
    await queryRunner.query(`DROP TABLE "controle_ponto"`);
    await queryRunner.query(`DROP TABLE "cracha_rfid"`);
  }
}
