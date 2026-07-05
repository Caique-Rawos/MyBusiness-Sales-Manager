import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasPagarModule } from 'src/modules/contas_pagar/contas_pagar.module';
import { ContasReceberModule } from 'src/modules/contas_receber/contas_receber.module';
import { PagamentoService } from './application/pagamento.service';
import { PAGAMENTO_REPOSITORY } from './domain/pagamento.repository';
import { PagamentoOrmEntity } from './infra/typeorm/pagamento.entity';
import { PagamentoTypeOrmRepository } from './infra/typeorm/pagamento.repository';
import { PagamentoController } from './presentation/pagamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PagamentoOrmEntity]),
    ContasReceberModule,
    ContasPagarModule,
  ],
  controllers: [PagamentoController],
  providers: [
    PagamentoService,
    {
      provide: PAGAMENTO_REPOSITORY,
      useClass: PagamentoTypeOrmRepository,
    },
  ],
  exports: [PagamentoService],
})
export class PagamentoModule {}
