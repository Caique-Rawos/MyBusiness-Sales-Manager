import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './entity/categoria.entity';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(
    @Body() categoryData: CategoriaEntity,
  ): Promise<CategoriaEntity> {
    return this.categoriaService.create(categoryData);
  }

  @Get()
  async findAll(): Promise<CategoriaEntity[]> {
    return this.categoriaService.findAll();
  }
}
