import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriaService } from '../application/categoria.service';
import { CreateCategoriaDto } from '../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../application/dto/update-categoria.dto';
import { Categoria } from '../domain/categoria';

@ApiTags('Categorias')
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @ApiOperation({ summary: 'Criar categoria' })
  @Post()
  create(@Body() data: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.create(data);
  }

  @ApiOperation({ summary: 'Listar categorias' })
  @Get()
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<Categoria> {
    return this.categoriaService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover categoria' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.categoriaService.delete(Number(id));
  }
}
