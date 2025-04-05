import { Body, Controller, Get, Post } from '@nestjs/common';
import { LojaEntity } from './entity/loja.entity';
import { LojaService } from './loja.service';

@Controller('loja')
export class LojaController {
  constructor(private readonly LojaService: LojaService) {}

  @Post()
  async create(@Body() lojaData: LojaEntity): Promise<LojaEntity> {
    return this.LojaService.create(lojaData);
  }

  @Get()
  async findOnly(): Promise<LojaEntity> {
    return this.LojaService.findOnly();
  }
}
