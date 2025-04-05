import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginasEntity } from './entity/paginas.entity';
import { PaginasController } from './paginas.controller';
import { PaginasService } from './paginas.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaginasEntity])],
  controllers: [PaginasController],
  providers: [PaginasService],
  exports: [PaginasService],
})
export class PaginasModule {}
