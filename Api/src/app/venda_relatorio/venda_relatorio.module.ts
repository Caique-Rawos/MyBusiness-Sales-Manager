import { Module } from '@nestjs/common';
import { VendaRelatorioService } from './venda_relatorio.service';
import { VendaRelatorioController } from './venda_relatorio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaEntity } from '../venda/entity/venda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity])],
  providers: [VendaRelatorioService],
  controllers: [VendaRelatorioController],
})
export class VendaRelatorioModule {}
