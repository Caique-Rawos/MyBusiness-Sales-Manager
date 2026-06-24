import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClienteService } from '../application/cliente.service';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';
import { Cliente } from '../domain/cliente';

@ApiTags('Clientes')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'Criar cliente' })
  @Post()
  create(@Body() data: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(data);
  }

  @ApiOperation({ summary: 'Listar clientes' })
  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @Get(':id')
  findById(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar cliente' })
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateClienteDto): Promise<Cliente> {
    return this.clienteService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover cliente' })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.clienteService.delete(Number(id));
  }
}
