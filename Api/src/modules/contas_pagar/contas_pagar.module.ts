import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasPagarService } from './application/contas_pagar.service';
import { CONTAS_PAGAR_REPOSITORY } from './domain/contas_pagar.repository';
import { ContasPagarOrmEntity } from './infra/typeorm/contas_pagar.entity';
import { ContasPagarTypeOrmRepository } from './infra/typeorm/contas_pagar.repository';
import { ContasPagarController } from './presentation/contas_pagar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContasPagarOrmEntity])],
  controllers: [ContasPagarController],
  providers: [
    ContasPagarService,
    {
      provide: CONTAS_PAGAR_REPOSITORY,
      useClass: ContasPagarTypeOrmRepository,
    },
  ],
  exports: [ContasPagarService],
})
export class ContasPagarModule {}