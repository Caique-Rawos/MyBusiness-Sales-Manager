import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { VendaItemModule } from 'src/modules/venda_item/venda_item.module';
import { QUEUE_NAMES } from 'src/shared/queue-names';
import { VendaProcessor } from './application/venda.processor';
import { VendaService } from './application/venda.service';
import { VENDA_REPOSITORY } from './domain/venda.repository';
import { VendaTypeOrmRepository } from './infra/typeorm/venda.repository';
import { VendaController } from './presentation/venda.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_NAMES.VENDA }),
    BullModule.registerQueue({ name: QUEUE_NAMES.ESTOQUE }),
    BullModule.registerQueue({ name: QUEUE_NAMES.CONTAS_RECEBER }),
    VendaItemModule,
  ],
  controllers: [VendaController],
  providers: [
    VendaService,
    VendaProcessor,
    {
      provide: VENDA_REPOSITORY,
      useClass: VendaTypeOrmRepository,
    },
  ],
  exports: [VendaService],
})
export class VendaModule {}
