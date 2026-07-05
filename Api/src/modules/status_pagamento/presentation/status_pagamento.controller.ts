import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { StatusPagamentoService } from '../application/status_pagamento.service';
import { CreateStatusPagamentoDto } from '../application/dto/create-status_pagamento.dto';
import { UpdateStatusPagamentoDto } from '../application/dto/update-status_pagamento.dto';
import { StatusPagamento } from '../domain/status_pagamento';

@Controller('status_pagamento')
export class StatusPagamentoController {
  constructor(private readonly statusPagamentoService: StatusPagamentoService) {}

  @Post()
  create(@Body() data: CreateStatusPagamentoDto): Promise<StatusPagamento> {
    return this.statusPagamentoService.create(data);
  }

  @Get()
  findAll(): Promise<StatusPagamento[]> {
    return this.statusPagamentoService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<StatusPagamento> {
    return this.statusPagamentoService.findById(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateStatusPagamentoDto,
  ): Promise<StatusPagamento> {
    return this.statusPagamentoService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.statusPagamentoService.delete(Number(id));
  }
}