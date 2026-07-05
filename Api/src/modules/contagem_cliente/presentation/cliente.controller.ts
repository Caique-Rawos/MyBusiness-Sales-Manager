import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddContagemClienteDto } from '../application/dto/add-contagem_cliente.dto';
import { ContagemCliente } from '../domain/contagem_cliente';
import { ContagemClienteService } from '../application/contagem_cliente.service';

@Controller('contagem-cliente')
export class ContagemClienteController {
  constructor(
    private readonly contagemClienteService: ContagemClienteService,
  ) {}

  @Post()
  add(@Body() data: AddContagemClienteDto): Promise<boolean> {
    return this.contagemClienteService.add(data);
  }

  @Get()
  findToday(): Promise<ContagemCliente | null> {
    return this.contagemClienteService.findToday();
  }
}
