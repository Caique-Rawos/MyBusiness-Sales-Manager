import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { VendaService } from '../application/venda.service';
import { CreateVendaDto } from '../application/dto/create-venda.dto';
import { UpdateVendaDto } from '../application/dto/update-venda.dto';
import { Venda } from '../domain/venda';
import { IVendaPrevisao } from '../domain/venda_previsao';

@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  create(@Body() data: CreateVendaDto): Promise<Venda> {
    return this.vendaService.create(data);
  }

  @Get()
  findAll(): Promise<Venda[]> {
    return this.vendaService.findAll();
  }

  @Get('previsao-venda')
  findVendasFuturas(): Promise<IVendaPrevisao[]> {
    return this.vendaService.findVendasFuturas();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Venda> {
    return this.vendaService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVendaDto): Promise<Venda> {
    return this.vendaService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.vendaService.delete(Number(id));
  }
}
