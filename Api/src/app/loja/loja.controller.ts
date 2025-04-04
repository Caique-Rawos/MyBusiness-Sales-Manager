import { Body, Controller, Get, Post } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaEntity } from './entity/loja.entity';

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
