import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContasPagarService } from '../application/contas_pagar.service';
import { CreateContasPagarDto } from '../application/dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from '../application/dto/update-contas_pagar.dto';
import { ContasPagar } from '../domain/contas_pagar';

@Controller('contas_pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

  @Post()
  create(@Body() data: CreateContasPagarDto): Promise<ContasPagar> {
    return this.contasPagarService.create(data);
  }

  @Get()
  findAll(): Promise<ContasPagar[]> {
    return this.contasPagarService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ContasPagar> {
    return this.contasPagarService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateContasPagarDto): Promise<ContasPagar> {
    return this.contasPagarService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contasPagarService.delete(Number(id));
  }
}