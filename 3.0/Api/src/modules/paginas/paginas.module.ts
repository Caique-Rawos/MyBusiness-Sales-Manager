import { Module } from '@nestjs/common';
import { PaginasService } from './application/paginas.service';
import { PAGINAS_REPOSITORY } from './domain/paginas.repository';
import { PaginasTypeOrmRepository } from './infra/typeorm/paginas.repository';
import { PaginasController } from './presentation/paginas.controller';

@Module({
  imports: [],
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