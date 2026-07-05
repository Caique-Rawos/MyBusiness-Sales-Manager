import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PagamentoService } from '../application/pagamento.service';
import { CreatePagamentoDto } from '../application/dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../application/dto/update-pagamento.dto';
import { Pagamento } from '../domain/pagamento';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  create(@Body() data: CreatePagamentoDto): Promise<Pagamento> {
    return this.pagamentoService.create(data);
  }

  @Get()
  findAll(): Promise<Pagamento[]> {
    return this.pagamentoService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Pagamento> {
    return this.pagamentoService.findById(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePagamentoDto): Promise<Pagamento> {
    return this.pagamentoService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.pagamentoService.delete(Number(id));
  }
}