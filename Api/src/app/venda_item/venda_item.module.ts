import { Module } from '@nestjs/common';
import { VendaItemService } from './venda_item.service';
import { VendaItemController } from './venda_item.controller';
import { VendaItemEntity } from './entity/venda_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VendaItemEntity])],
  providers: [VendaItemService],
  controllers: [VendaItemController],
})
export class VendaItemModule {}
