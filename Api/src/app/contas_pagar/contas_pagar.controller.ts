import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarEntity } from './entity/contas_pagar.entity';

@Controller('contas_pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

  @Post()
  async create(
    @Body() contasPagarData: ContasPagarEntity,
  ): Promise<ContasPagarEntity> {
    return this.contasPagarService.create(contasPagarData);
  }

  @Get()
  async findAll(): Promise<ContasPagarEntity[]> {
    return this.contasPagarService.findAll();
  }
}
