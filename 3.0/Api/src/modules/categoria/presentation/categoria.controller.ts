import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { CategoriaService } from '../application/categoria.service';
import { CreateCategoriaDto } from '../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../application/dto/update-categoria.dto';
import { Categoria } from '../domain/categoria';

@ApiTags('Categorias')
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @ApiOperation({ summary: 'Criar categoria' })
  @RequirePermission(PERMISSOES.CATEGORIA.criar)
  @Post()
  create(@Body() data: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.create(data);
  }

  @ApiOperation({ summary: 'Listar categorias' })
  @RequirePermission(PERMISSOES.CATEGORIA.listar)
  @Get()
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @RequirePermission(PERMISSOES.CATEGORIA.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Categoria> {
    return this.categoriaService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @RequirePermission(PERMISSOES.CATEGORIA.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover categoria' })
  @RequirePermission(PERMISSOES.CATEGORIA.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.categoriaService.delete(Number(id));
  }
}
