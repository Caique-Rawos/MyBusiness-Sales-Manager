import { Body, Controller, Get, Post } from '@nestjs/common';
import { PagamentoEntity } from './entity/pagamento.entity';
import { PagamentoService } from './pagamento.service';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  async create(
    @Body() pagamentoData: PagamentoEntity,
  ): Promise<PagamentoEntity> {
    return this.pagamentoService.create(pagamentoData);
  }

  @Get()
  async findAll(): Promise<PagamentoEntity[]> {
    return this.pagamentoService.findAll();
  }
}
