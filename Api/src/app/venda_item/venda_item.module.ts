import { Module } from '@nestjs/common';
import { VendaItemService } from './venda_item.service';
import { VendaItemController } from './venda_item.controller';
import { VendaItemEntity } from './entity/venda_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaModule } from '../venda/venda.module';
import { VendaService } from '../venda/venda.service';
import { VendaEntity } from '../venda/entity/venda.entity';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendaItemEntity,
      VendaEntity,
      ContasReceberEntity,
    ]),
    VendaModule,
  ],
  providers: [VendaItemService, VendaService, ContasReceberService],
  controllers: [VendaItemController],
})
export class VendaItemModule {}
