import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberService } from './application/contas_receber.service';
import { CONTAS_RECEBER_REPOSITORY } from './domain/contas_receber.repository';
import { ContasReceberOrmEntity } from './infra/typeorm/contas_receber.entity';
import { ContasReceberTypeOrmRepository } from './infra/typeorm/contas_receber.repository';
import { ContasReceberController } from './presentation/contas_receber.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContasReceberOrmEntity])],
  controllers: [ContasReceberController],
  providers: [
    ContasReceberService,
    {
      provide: CONTAS_RECEBER_REPOSITORY,
      useClass: ContasReceberTypeOrmRepository,
    },
  ],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}