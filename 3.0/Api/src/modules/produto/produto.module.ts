import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { VendaItemModule } from 'src/modules/venda_item/venda_item.module';
import { QUEUE_NAMES } from 'src/shared/queue-names';
import { ProdutoService } from './application/produto.service';
import { PRODUTO_REPOSITORY } from './domain/produto.repository';
import { ProdutoTypeOrmRepository } from './infra/typeorm/produto.repository';
import { ProdutoController } from './presentation/produto.controller';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.ESTOQUE }), VendaItemModule],
  controllers: [ProdutoController],
  providers: [
    ProdutoService,
    {
      provide: PRODUTO_REPOSITORY,
      useClass: ProdutoTypeOrmRepository,
    },
  ],
  exports: [ProdutoService],
})
export class ProdutoModule {}
