import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberEntity } from './entity/contas_receber.entity';

@Controller('contas_receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @Post()
  async create(
    @Body() contasReceberData: ContasReceberEntity,
  ): Promise<ContasReceberEntity> {
    return this.contasReceberService.create(contasReceberData);
  }

  @Get()
  async findAll(): Promise<ContasReceberEntity[]> {
    return this.contasReceberService.findAll();
  }
}
