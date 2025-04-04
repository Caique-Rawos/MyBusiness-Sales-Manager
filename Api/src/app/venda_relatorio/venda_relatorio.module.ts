import { Module } from '@nestjs/common';
import { VendaRelatorioService } from './venda_relatorio.service';
import { VendaRelatorioController } from './venda_relatorio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from '../venda/entity/venda.entity';
import { LojaModule } from '../loja/loja.module';

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity]), LojaModule],
  providers: [VendaRelatorioService],
  controllers: [VendaRelatorioController],
})
export class VendaRelatorioModule {}
