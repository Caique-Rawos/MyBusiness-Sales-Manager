import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateLojaDto } from '../application/dto/create-loja.dto';
import { UpdateLojaDto } from '../application/dto/update-loja.dto';
import { LojaService } from '../application/loja.service';
import { Loja } from '../domain/loja';

@Controller('loja')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Post()
  create(@Body() data: CreateLojaDto): Promise<Loja> {
    return this.lojaService.create(data);
  }

  @Get()
  findAll(): Promise<Loja[]> {
    return this.lojaService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Loja> {
    return this.lojaService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateLojaDto): Promise<Loja> {
    return this.lojaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.lojaService.delete(Number(id));
  }
}
