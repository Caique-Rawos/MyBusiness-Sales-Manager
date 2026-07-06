import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { ClienteService } from '../application/cliente.service';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';
import { Cliente } from '../domain/cliente';

@ApiTags('Clientes')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @ApiOperation({ summary: 'Criar cliente' })
  @RequirePermission(PERMISSOES.CLIENTE.criar)
  @Post()
  create(@Body() data: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(data);
  }

  @ApiOperation({ summary: 'Listar clientes' })
  @RequirePermission(PERMISSOES.CLIENTE.listar)
  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @RequirePermission(PERMISSOES.CLIENTE.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Cliente> {
    return this.clienteService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar cliente' })
  @RequirePermission(PERMISSOES.CLIENTE.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateClienteDto): Promise<Cliente> {
    return this.clienteService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover cliente' })
  @RequirePermission(PERMISSOES.CLIENTE.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.clienteService.delete(Number(id));
  }
}
