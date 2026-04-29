import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePaginasDto } from '../application/dto/create-paginas.dto';
import { UpdatePaginasDto } from '../application/dto/update-paginas.dto';
import { PaginasService } from '../application/paginas.service';
import { Paginas } from '../domain/paginas';

@Controller('paginas')
export class PaginasController {
  constructor(private readonly paginasService: PaginasService) {}

  @Post()
  create(@Body() data: CreatePaginasDto): Promise<Paginas> {
    return this.paginasService.create(data);
  }

  @Get()
  findAll(): Promise<Paginas[]> {
    return this.paginasService.findAll();
  }

  @Get(':alias')
  findByAlias(@Param('alias') alias: string): Promise<Paginas> {
    return this.paginasService.findByAlias(alias);
  }

  @Put(':alias')
  update(
    @Param('alias') alias: string,
    @Body() data: UpdatePaginasDto,
  ): Promise<Paginas> {
    return this.paginasService.update(alias, data);
  }

  @Delete(':alias')
  delete(@Param('alias') alias: string): Promise<void> {
    return this.paginasService.delete(alias);
  }
}
