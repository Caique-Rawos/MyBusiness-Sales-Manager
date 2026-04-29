import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from '../produto/produto.module';
import { VendaModule } from '../venda/venda.module';
import { VendaItemService } from './application/venda_item.service';
import { VENDA_ITEM_REPOSITORY } from './domain/venda_item.repository';
import { VendaItemOrmEntity } from './infra/typeorm/venda_item.entity';
import { VendaItemTypeOrmRepository } from './infra/typeorm/venda_item.repository';
import { VendaItemController } from './presentation/venda_item.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendaItemOrmEntity]),
    VendaModule,
    ProdutoModule,
  ],
  controllers: [VendaItemController],
  providers: [
    VendaItemService,
    {
      provide: VENDA_ITEM_REPOSITORY,
      useClass: VendaItemTypeOrmRepository,
    },
  ],
  exports: [VendaItemService],
})
export class VendaItemModule {}