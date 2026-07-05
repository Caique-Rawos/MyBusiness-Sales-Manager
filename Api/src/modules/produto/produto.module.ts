import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoService } from './application/produto.service';
import { PRODUTO_REPOSITORY } from './domain/produto.repository';
import { ProdutoOrmEntity } from './infra/typeorm/produto.entity';
import { ProdutoTypeOrmRepository } from './infra/typeorm/produto.repository';
import { ProdutoController } from './presentation/produto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProdutoOrmEntity])],
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