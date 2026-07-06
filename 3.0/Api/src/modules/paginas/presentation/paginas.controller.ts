import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { CreatePaginasDto } from '../application/dto/create-paginas.dto';
import { UpdatePaginasDto } from '../application/dto/update-paginas.dto';
import { PaginasService } from '../application/paginas.service';
import { Paginas } from '../domain/paginas';

@ApiTags('Páginas')
@Controller('paginas')
export class PaginasController {
  constructor(private readonly paginasService: PaginasService) {}

  @ApiOperation({ summary: 'Criar página' })
  @RequirePermission(PERMISSOES.PAGINAS.criar)
  @Post()
  create(@Body() data: CreatePaginasDto): Promise<Paginas> {
    return this.paginasService.create(data);
  }

  @ApiOperation({ summary: 'Listar páginas' })
  @RequirePermission(PERMISSOES.PAGINAS.listar)
  @Get()
  findAll(): Promise<Paginas[]> {
    return this.paginasService.findAll();
  }

  @ApiOperation({ summary: 'Buscar página por alias' })
  @RequirePermission(PERMISSOES.PAGINAS.listar)
  @Get(':alias')
  findByAlias(@Param('alias') alias: string): Promise<Paginas> {
    return this.paginasService.findByAlias(alias);
  }

  @ApiOperation({ summary: 'Atualizar página' })
  @RequirePermission(PERMISSOES.PAGINAS.editar)
  @Put(':alias')
  update(@Param('alias') alias: string, @Body() data: UpdatePaginasDto): Promise<Paginas> {
    return this.paginasService.update(alias, data);
  }

  @ApiOperation({ summary: 'Remover página' })
  @RequirePermission(PERMISSOES.PAGINAS.deletar)
  @Delete(':alias')
  delete(@Param('alias') alias: string): Promise<void> {
    return this.paginasService.delete(alias);
  }
}
