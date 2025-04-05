import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberModule } from '../contas_receber/contas_receber.module';
import { ProdutoModule } from '../produto/produto.module';
import { VendaModule } from '../venda/venda.module';
import { VendaItemEntity } from './entity/venda_item.entity';
import { VendaItemController } from './venda_item.controller';
import { VendaItemService } from './venda_item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaItemEntity]),
    VendaModule,
    ContasReceberModule,
    ProdutoModule,
  ],
  providers: [VendaItemService],
  controllers: [VendaItemController],
  exports: [VendaItemService],
})
export class VendaItemModule {}
