import { Module } from '@nestjs/common';
import { ContasPagarService } from './application/contas_pagar.service';
import { CONTAS_PAGAR_REPOSITORY } from './domain/contas_pagar.repository';
import { ContasPagarTypeOrmRepository } from './infra/typeorm/contas_pagar.repository';
import { ContasPagarController } from './presentation/contas_pagar.controller';

@Module({
  imports: [],
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