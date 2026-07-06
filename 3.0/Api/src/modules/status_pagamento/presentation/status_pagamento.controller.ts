import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatusPagamentoService } from '../application/status_pagamento.service';
import { CreateStatusPagamentoDto } from '../application/dto/create-status_pagamento.dto';
import { UpdateStatusPagamentoDto } from '../application/dto/update-status_pagamento.dto';
import { StatusPagamento } from '../domain/status_pagamento';

@ApiTags('Status de Pagamento')
@Controller('status-pagamento')
export class StatusPagamentoController {
  constructor(private readonly statusPagamentoService: StatusPagamentoService) {}

  @ApiOperation({ summary: 'Criar status de pagamento' })
  @Post()
  create(@Body() data: CreateStatusPagamentoDto): Promise<StatusPagamento> {
    return this.statusPagamentoService.create(data);
  }

  @ApiOperation({ summary: 'Listar status de pagamento' })
  @Get()
  findAll(): Promise<StatusPagamento[]> {
    return this.statusPagamentoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar status de pagamento por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<StatusPagamento> {
    return this.statusPagamentoService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar status de pagamento' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateStatusPagamentoDto): Promise<StatusPagamento> {
    return this.statusPagamentoService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover status de pagamento' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.statusPagamentoService.delete(Number(id));
  }
}
