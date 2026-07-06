import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1783307998184 implements MigrationInterface {
    name = 'Initial1783307998184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cliente" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "cpfCnpj" character varying(18) NOT NULL, "observacao" text, CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contagem_cliente" ("id" SERIAL NOT NULL, "contagem" integer NOT NULL DEFAULT '0', "data" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a413834f33e8d1c772d2ae42b30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pagamento" ("id" SERIAL NOT NULL, "descricao" character varying(50) NOT NULL, "taxa" numeric(13,2) DEFAULT '0', CONSTRAINT "PK_ac81e75b741a26f350c5fb1ff20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status_pagamento" ("id" SERIAL NOT NULL, "descricao" character varying(50) NOT NULL, "cor" character varying(50) NOT NULL, CONSTRAINT "PK_e3323e9c1478faca6c5e6436a1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contas_pagar" ("id" SERIAL NOT NULL, "descricao" character varying(150) NOT NULL, "valorTotal" numeric(13,2) NOT NULL, "valorPago" numeric(13,2) DEFAULT '0', "dataVencimento" TIMESTAMP DEFAULT now(), "id_pagamento" integer NOT NULL, "id_status_pagamento" integer NOT NULL, CONSTRAINT "PK_2f0a30e7ee98c3035dcce83ebe7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regra_fiscal" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, "ncm" character varying(10) NOT NULL, "icms" numeric(5,2) NOT NULL, "pis" numeric(5,2) NOT NULL, "cofins" numeric(5,2) NOT NULL, "ipi" numeric(5,2), CONSTRAINT "PK_e33f010d74a44b7fc699ce59500" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "produto" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, "codigoDeBarra" character varying(20), "valorCusto" numeric(13,2) NOT NULL, "valorVenda" numeric(13,2) NOT NULL, "estoque" integer NOT NULL, "unidade" character varying(10) NOT NULL, "image" bytea, "id_categoria" integer NOT NULL, "id_regra_fiscal" integer, CONSTRAINT "PK_99c4351f9168c50c0736e6a66be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venda_item" ("id" SERIAL NOT NULL, "precoUnitario" numeric(13,2) NOT NULL, "desconto" numeric(13,2) DEFAULT '0', "quantidade" numeric(13,2) NOT NULL, "subTotal" numeric(13,2) NOT NULL, "id_venda" integer NOT NULL, "id_produto" integer NOT NULL, CONSTRAINT "PK_41aec7dde9fa41407cec7fb406d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venda" ("id" SERIAL NOT NULL, "totalVenda" numeric(13,2) DEFAULT '0', "dataVenda" TIMESTAMP DEFAULT now(), "id_cliente" integer NOT NULL, CONSTRAINT "PK_e54dc36860bef073e9ab638b444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contas_receber" ("id" SERIAL NOT NULL, "descricao" character varying(150) NOT NULL, "valorTotal" numeric(13,2) NOT NULL, "valorPago" numeric(13,2) DEFAULT '0', "dataVencimento" TIMESTAMP DEFAULT now(), "id_pagamento" integer NOT NULL, "id_status_pagamento" integer NOT NULL, "id_venda" integer, CONSTRAINT "REL_d19878115f9838b45831fc11a6" UNIQUE ("id_venda"), CONSTRAINT "PK_5837d45d5a8b6904175f1e0f56f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movimento_estoque" ("id" SERIAL NOT NULL, "tipo" character varying(20) NOT NULL, "quantidade" numeric(13,2) NOT NULL, "id_produto" integer NOT NULL, "motivo" character varying(100), "id_venda" integer, "id_venda_item" integer, "data_movimento" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_089222933c2d3e7c877cb22a659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loja" ("id" integer NOT NULL, "nomeFantasia" character varying(60) NOT NULL, "cpfCnpj" character varying(18) NOT NULL, "ie" character varying(15), "endereco" character varying(100) NOT NULL, CONSTRAINT "PK_81ad5d6a90a7a01aa53b334cea9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paginas" ("id" SERIAL NOT NULL, "descricao" character varying(100) NOT NULL, "alias" character varying(100) NOT NULL, "arquivo" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_bee7ea3af0c268319010bbc2e4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contas_pagar" ADD CONSTRAINT "FK_44199a9b9ad8a0edc72d9ba79d5" FOREIGN KEY ("id_pagamento") REFERENCES "pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contas_pagar" ADD CONSTRAINT "FK_d1b896850f4d35db617a5e4c8f0" FOREIGN KEY ("id_status_pagamento") REFERENCES "status_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "produto" ADD CONSTRAINT "FK_b4b4301786e895495ebff7687a8" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "produto" ADD CONSTRAINT "FK_71fcf019bc109e35a8a15e879cd" FOREIGN KEY ("id_regra_fiscal") REFERENCES "regra_fiscal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venda_item" ADD CONSTRAINT "FK_f40d8d764e9b951668737637a2f" FOREIGN KEY ("id_venda") REFERENCES "venda"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venda_item" ADD CONSTRAINT "FK_34be6cddc829425b352d0fe1b97" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venda" ADD CONSTRAINT "FK_a8a0ff255844d5da75276d5c729" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contas_receber" ADD CONSTRAINT "FK_7db04f8dd3ef9ad6f58a2617a6d" FOREIGN KEY ("id_pagamento") REFERENCES "pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contas_receber" ADD CONSTRAINT "FK_1ef61cce446868665d1444764a9" FOREIGN KEY ("id_status_pagamento") REFERENCES "status_pagamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contas_receber" ADD CONSTRAINT "FK_d19878115f9838b45831fc11a69" FOREIGN KEY ("id_venda") REFERENCES "venda"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimento_estoque" ADD CONSTRAINT "FK_1df224bacbcdf82fcd9c2cf3e7c" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimento_estoque" DROP CONSTRAINT "FK_1df224bacbcdf82fcd9c2cf3e7c"`);
        await queryRunner.query(`ALTER TABLE "contas_receber" DROP CONSTRAINT "FK_d19878115f9838b45831fc11a69"`);
        await queryRunner.query(`ALTER TABLE "contas_receber" DROP CONSTRAINT "FK_1ef61cce446868665d1444764a9"`);
        await queryRunner.query(`ALTER TABLE "contas_receber" DROP CONSTRAINT "FK_7db04f8dd3ef9ad6f58a2617a6d"`);
        await queryRunner.query(`ALTER TABLE "venda" DROP CONSTRAINT "FK_a8a0ff255844d5da75276d5c729"`);
        await queryRunner.query(`ALTER TABLE "venda_item" DROP CONSTRAINT "FK_34be6cddc829425b352d0fe1b97"`);
        await queryRunner.query(`ALTER TABLE "venda_item" DROP CONSTRAINT "FK_f40d8d764e9b951668737637a2f"`);
        await queryRunner.query(`ALTER TABLE "produto" DROP CONSTRAINT "FK_71fcf019bc109e35a8a15e879cd"`);
        await queryRunner.query(`ALTER TABLE "produto" DROP CONSTRAINT "FK_b4b4301786e895495ebff7687a8"`);
        await queryRunner.query(`ALTER TABLE "contas_pagar" DROP CONSTRAINT "FK_d1b896850f4d35db617a5e4c8f0"`);
        await queryRunner.query(`ALTER TABLE "contas_pagar" DROP CONSTRAINT "FK_44199a9b9ad8a0edc72d9ba79d5"`);
        await queryRunner.query(`DROP TABLE "paginas"`);
        await queryRunner.query(`DROP TABLE "loja"`);
        await queryRunner.query(`DROP TABLE "movimento_estoque"`);
        await queryRunner.query(`DROP TABLE "contas_receber"`);
        await queryRunner.query(`DROP TABLE "venda"`);
        await queryRunner.query(`DROP TABLE "venda_item"`);
        await queryRunner.query(`DROP TABLE "produto"`);
        await queryRunner.query(`DROP TABLE "regra_fiscal"`);
        await queryRunner.query(`DROP TABLE "contas_pagar"`);
        await queryRunner.query(`DROP TABLE "status_pagamento"`);
        await queryRunner.query(`DROP TABLE "pagamento"`);
        await queryRunner.query(`DROP TABLE "contagem_cliente"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
    }

}
