import { Module } from '@nestjs/common';
import { ProdutoModule } from 'src/modules/produto/produto.module';
import { CategoriaService } from './application/categoria.service';
import { CATEGORIA_REPOSITORY } from './domain/categoria.repository';
import { CategoriaTypeOrmRepository } from './infra/typeorm/categoria.repository';
import { CategoriaController } from './presentation/categoria.controller';

@Module({
  imports: [ProdutoModule],
  controllers: [CategoriaController],
  providers: [
    CategoriaService,
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: CategoriaTypeOrmRepository,
    },
  ],
  exports: [CategoriaService],
})
export class CategoriaModule {}
