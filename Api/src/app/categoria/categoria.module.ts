import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaEntity } from './entity/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  providers: [CategoriaService],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
