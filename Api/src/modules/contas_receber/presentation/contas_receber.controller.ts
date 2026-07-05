import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContasReceberService } from '../application/contas_receber.service';
import { CreateContasReceberDto } from '../application/dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from '../application/dto/update-contas_receber.dto';
import { ContasReceber } from '../domain/contas_receber';

@Controller('contas_receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @Post()
  create(@Body() data: CreateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.create(data);
  }

  @Get()
  findAll(): Promise<ContasReceber[]> {
    return this.contasReceberService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ContasReceber> {
    return this.contasReceberService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contasReceberService.delete(Number(id));
  }
}