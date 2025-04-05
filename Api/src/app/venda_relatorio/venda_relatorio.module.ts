import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaModule } from '../loja/loja.module';
import { VendaEntity } from '../venda/entity/venda.entity';
import { VendaRelatorioController } from './venda_relatorio.controller';
import { VendaRelatorioService } from './venda_relatorio.service';

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity]), LojaModule],
  providers: [VendaRelatorioService],
  controllers: [VendaRelatorioController],
  exports: [VendaRelatorioService],
})
export class VendaRelatorioModule {}
