import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from 'src/modules/produto/produto.module';
import { CategoriaService } from './application/categoria.service';
import { CATEGORIA_REPOSITORY } from './domain/categoria.repository';
import { CategoriaOrmEntity } from './infra/typeorm/categoria.entity';
import { CategoriaTypeOrmRepository } from './infra/typeorm/categoria.repository';
import { CategoriaController } from './presentation/categoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaOrmEntity]), ProdutoModule],
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
