import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeOrmOptions } from './shared/database/typeorm-options';
import { catalogEntities } from './shared/entities/catalog-entities';
import { tenantEntities } from './shared/entities/tenant-entities';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { ContasPagarModule } from './modules/contas_pagar/contas_pagar.module';
import { ContasReceberModule } from './modules/contas_receber/contas_receber.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { LojaModule } from './modules/loja/loja.module';
import { PagamentoModule } from './modules/pagamento/pagamento.module';
import { PaginasModule } from './modules/paginas/paginas.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { RegraFiscalModule } from './modules/regra_fiscal/regra_fiscal.module';
import { StatusPagamentoModule } from './modules/status_pagamento/status_pagamento.module';
import { VendaModule } from './modules/venda/venda.module';
import { VendaItemModule } from './modules/venda_item/venda_item.module';
import { VendaRelatorioModule } from './modules/venda_relatorio/venda_relatorio.module';
import { ContagemClienteModule } from './modules/contagem_cliente/contagem_cliente.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forRoot({
      ...buildTypeOrmOptions(),
      entities: [...catalogEntities, ...tenantEntities],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.js,.ts}'],
      migrationsRun: true,
    } as TypeOrmModuleOptions),
    PaginasModule,
    EstoqueModule,
    ProdutoModule,
    CategoriaModule,
    ClienteModule,
    ContagemClienteModule,
    VendaModule,
    VendaItemModule,
    PagamentoModule,
    StatusPagamentoModule,
    ContasPagarModule,
    ContasReceberModule,
    VendaRelatorioModule,
    RegraFiscalModule,
    LojaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
