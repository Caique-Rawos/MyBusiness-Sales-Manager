import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendaEntity } from './entity/venda.entity';
import { VendaService } from './venda.service';

@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  async create(@Body() vendaData: VendaEntity): Promise<VendaEntity> {
    const result = await this.vendaService.create(vendaData);
    return result;
  }

  @Get()
  async findAll(): Promise<VendaEntity[]> {
    return this.vendaService.findAll();
  }
}
