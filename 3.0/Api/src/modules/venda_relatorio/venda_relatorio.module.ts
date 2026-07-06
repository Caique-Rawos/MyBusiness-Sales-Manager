import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaModule } from '../loja/loja.module';
import { VendaRelatorioService } from './application/venda_relatorio.service';
import { VENDA_RELATORIO_REPOSITORY } from './domain/venda_relatorio.repository';
import { VendaOrmEntity } from '../venda/infra/typeorm/venda.entity';
import { VendaRelatorioTypeOrmRepository } from './infra/typeorm/venda_relatorio.repository';
import { VendaRelatorioController } from './presentation/venda_relatorio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VendaOrmEntity]), LojaModule],
  controllers: [VendaRelatorioController],
  providers: [
    VendaRelatorioService,
    {
      provide: VENDA_RELATORIO_REPOSITORY,
      useClass: VendaRelatorioTypeOrmRepository,
    },
  ],
})
export class VendaRelatorioModule {}