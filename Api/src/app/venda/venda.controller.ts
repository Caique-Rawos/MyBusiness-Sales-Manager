import { Body, Controller, Get, Post } from '@nestjs/common';
import { VendaService } from './venda.service';
import { VendaEntity } from './entity/venda.entity';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';
import { ContasReceberService } from '../contas_receber/contas_receber.service';

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
