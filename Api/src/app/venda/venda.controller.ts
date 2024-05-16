import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendaService } from './venda.service';
import { VendaEntity } from './entity/venda.entity';

@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  async create(@Body() vendaData: VendaEntity): Promise<VendaEntity> {
    return this.vendaService.create(vendaData);
  }

  @Get()
  async findAll(): Promise<VendaEntity[]> {
    return this.vendaService.findAll();
  }
}
