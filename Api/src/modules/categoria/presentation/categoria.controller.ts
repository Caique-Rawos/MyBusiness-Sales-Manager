import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriaService } from '../application/categoria.service';
import { CreateCategoriaDto } from '../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../application/dto/update-categoria.dto';
import { Categoria } from '../domain/categoria';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  create(@Body() data: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriaService.create(data);
  }

  @Get()
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Categoria> {
    return this.categoriaService.findById(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return this.categoriaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.categoriaService.delete(Number(id));
  }
}