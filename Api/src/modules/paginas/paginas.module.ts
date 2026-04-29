import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginasService } from './application/paginas.service';
import { PAGINAS_REPOSITORY } from './domain/paginas.repository';
import { PaginasOrmEntity } from './infra/typeorm/paginas.entity';
import { PaginasTypeOrmRepository } from './infra/typeorm/paginas.repository';
import { PaginasController } from './presentation/paginas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaginasOrmEntity])],
  controllers: [PaginasController],
  providers: [
    PaginasService,
    {
      provide: PAGINAS_REPOSITORY,
      useClass: PaginasTypeOrmRepository,
    },
  ],
  exports: [PaginasService],
})
export class PaginasModule {}