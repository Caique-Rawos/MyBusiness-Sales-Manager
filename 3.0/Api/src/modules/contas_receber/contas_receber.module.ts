import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUEUE_NAMES } from 'src/shared/queue-names';
import { ContasReceberProcessor } from './application/contas_receber.processor';
import { ContasReceberService } from './application/contas_receber.service';
import { CONTAS_RECEBER_REPOSITORY } from './domain/contas_receber.repository';
import { ContasReceberOrmEntity } from './infra/typeorm/contas_receber.entity';
import { ContasReceberTypeOrmRepository } from './infra/typeorm/contas_receber.repository';
import { ContasReceberController } from './presentation/contas_receber.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContasReceberOrmEntity]),
    BullModule.registerQueue({ name: QUEUE_NAMES.CONTAS_RECEBER }),
  ],
  controllers: [ContasReceberController],
  providers: [
    ContasReceberService,
    ContasReceberProcessor,
    {
      provide: CONTAS_RECEBER_REPOSITORY,
      useClass: ContasReceberTypeOrmRepository,
    },
  ],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}
