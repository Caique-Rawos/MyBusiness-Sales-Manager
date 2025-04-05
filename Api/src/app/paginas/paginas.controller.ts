import { Controller, Get, Param } from '@nestjs/common';
import { PaginasEntity } from './entity/paginas.entity';
import { PaginasService } from './paginas.service';

@Controller('paginas')
export class PaginasController {
  constructor(private readonly paginasService: PaginasService) {}

  @Get(':alias')
  getPagina(@Param('alias') alias: string): Promise<PaginasEntity> {
    return this.paginasService.getPaginaByAlias(alias);
  }
}
