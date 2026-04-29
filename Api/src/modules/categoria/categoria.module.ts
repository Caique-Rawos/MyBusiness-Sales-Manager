import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaService } from './application/categoria.service';
import {
  CATEGORIA_REPOSITORY,
} from './domain/categoria.repository';
import { CategoriaOrmEntity } from './infra/typeorm/categoria.entity';
import { CategoriaTypeOrmRepository } from './infra/typeorm/categoria.repository';
import { CategoriaController } from './presentation/categoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaOrmEntity])],
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