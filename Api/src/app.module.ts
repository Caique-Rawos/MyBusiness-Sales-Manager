import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaginasModule } from './app/paginas/paginas.module';
import { ProdutoModule } from './app/produto/produto.module';
import { CategoriaModule } from './app/categoria/categoria.module';
import { ClienteModule } from './app/cliente/cliente.module';
import { VendaModule } from './app/venda/venda.module';
import { VendaItemModule } from './app/venda_item/venda_item.module';
import { PagamentoModule } from './app/pagamento/pagamento.module';
import { StatusPagamentoModule } from './app/status_pagamento/status_pagamento.module';
import { ContasPagarModule } from './app/contas_pagar/contas_pagar.module';
import { ContasReceberModule } from './app/contas_receber/contas_receber.module';
import { VendaRelatorioModule } from './app/venda_relatorio/venda_relatorio.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_TYPE,
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
    } as TypeOrmModuleOptions),
    PaginasModule,
    ProdutoModule,
    CategoriaModule,
    ClienteModule,
    VendaModule,
    VendaItemModule,
    PagamentoModule,
    StatusPagamentoModule,
    ContasPagarModule,
    ContasReceberModule,
    VendaRelatorioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
