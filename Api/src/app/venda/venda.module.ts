import { Module } from '@nestjs/common';
import { VendaService } from './venda.service';
import { VendaController } from './venda.controller';
import { VendaEntity } from './entity/venda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendaEntity, ContasReceberEntity])],
  providers: [VendaService, ContasReceberService],
  controllers: [VendaController],
})
export class VendaModule {}
