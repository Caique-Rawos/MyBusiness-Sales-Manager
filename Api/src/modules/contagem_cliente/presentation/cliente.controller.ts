import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddContagemClienteDto } from '../application/dto/add-contagem_cliente.dto';
import { ContagemCliente } from '../domain/contagem_cliente';
import { ContagemClienteService } from '../application/contagem_cliente.service';

@ApiTags('Contagem de Clientes')
@Controller('contagem-cliente')
export class ContagemClienteController {
  constructor(private readonly contagemClienteService: ContagemClienteService) {}

  @ApiOperation({ summary: 'Registrar entrada ou saída de cliente' })
  @Post()
  add(@Body() data: AddContagemClienteDto): Promise<boolean> {
    return this.contagemClienteService.add(data);
  }

  @ApiOperation({ summary: 'Contagem de clientes do dia' })
  @Get()
  findToday(): Promise<ContagemCliente | null> {
    return this.contagemClienteService.findToday();
  }
}
