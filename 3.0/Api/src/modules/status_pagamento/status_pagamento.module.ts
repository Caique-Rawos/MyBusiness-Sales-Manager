import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasPagarModule } from 'src/modules/contas_pagar/contas_pagar.module';
import { ContasReceberModule } from 'src/modules/contas_receber/contas_receber.module';
import { StatusPagamentoService } from './application/status_pagamento.service';
import { STATUS_PAGAMENTO_REPOSITORY } from './domain/status_pagamento.repository';
import { StatusPagamentoOrmEntity } from './infra/typeorm/status_pagamento.entity';
import { StatusPagamentoTypeOrmRepository } from './infra/typeorm/status_pagamento.repository';
import { StatusPagamentoController } from './presentation/status_pagamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusPagamentoOrmEntity]),
    ContasReceberModule,
    ContasPagarModule,
  ],
  controllers: [StatusPagamentoController],
  providers: [
    StatusPagamentoService,
    {
      provide: STATUS_PAGAMENTO_REPOSITORY,
      useClass: StatusPagamentoTypeOrmRepository,
    },
  ],
  exports: [StatusPagamentoService],
})
export class StatusPagamentoModule {}
