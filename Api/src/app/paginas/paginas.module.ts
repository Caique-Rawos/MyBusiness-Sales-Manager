import { Module } from '@nestjs/common';
import { PaginasController } from './paginas.controller';
import { PaginasService } from './paginas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginasEntity } from './entity/paginas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaginasEntity])],
  controllers: [PaginasController],
  providers: [PaginasService],
})
export class PaginasModule {}
