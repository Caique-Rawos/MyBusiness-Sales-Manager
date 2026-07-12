import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ProdutoModule } from 'src/modules/produto/produto.module';
import { QUEUE_NAMES } from 'src/shared/queue-names';
import { EstoqueService } from './application/estoque.service';
import { EstoqueProcessor } from './application/estoque.processor';
import { MOVIMENTO_ESTOQUE_REPOSITORY } from './domain/movimento_estoque.repository';
import { MovimentoEstoqueTypeOrmRepository } from './infra/typeorm/movimento_estoque.repository';
import { EstoqueController } from './presentation/estoque.controller';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.ESTOQUE }), ProdutoModule],
  controllers: [EstoqueController],
  providers: [
    EstoqueService,
    EstoqueProcessor,
    {
      provide: MOVIMENTO_ESTOQUE_REPOSITORY,
      useClass: MovimentoEstoqueTypeOrmRepository,
    },
  ],
})
export class EstoqueModule {}
