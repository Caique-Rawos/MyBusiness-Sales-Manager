import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from 'src/shared/queue-names';
import { VendaItemService } from './application/venda_item.service';
import { VENDA_ITEM_REPOSITORY } from './domain/venda_item.repository';
import { VendaItemTypeOrmRepository } from './infra/typeorm/venda_item.repository';
import { VendaItemController } from './presentation/venda_item.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAMES.VENDA }),
    BullModule.registerQueue({ name: QUEUE_NAMES.ESTOQUE }),
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
