import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { StatusPagamentoService } from './status_pagamento.service';

@Controller('status_pagamento')
export class StatusPagamentoController {
  constructor(
    private readonly statusPagamentoService: StatusPagamentoService,
  ) {}

  @Post()
  async create(
    @Body() statusPagamentoData: StatusPagamentoEntity,
  ): Promise<StatusPagamentoEntity> {
    return this.statusPagamentoService.create(statusPagamentoData);
  }

  @Get()
  async findAll(): Promise<StatusPagamentoEntity[]> {
    return this.statusPagamentoService.findAll();
  }
}
