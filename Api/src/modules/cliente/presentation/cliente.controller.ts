import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClienteService } from '../application/cliente.service';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';
import { Cliente } from '../domain/cliente';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() data: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(data);
  }

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.findById(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.clienteService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.clienteService.delete(Number(id));
  }
}
