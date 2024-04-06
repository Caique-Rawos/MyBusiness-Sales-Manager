import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';

@Module({
  providers: [CategoriaService],
  controllers: [CategoriaController]
})
export class CategoriaModule {}
