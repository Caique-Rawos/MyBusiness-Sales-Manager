import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { ContasPagarService } from '../application/contas_pagar.service';
import { CreateContasPagarDto } from '../application/dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from '../application/dto/update-contas_pagar.dto';
import { ContasPagar } from '../domain/contas_pagar';

@ApiTags('Contas a Pagar')
@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

  @ApiOperation({ summary: 'Criar conta a pagar' })
  @RequirePermission(PERMISSOES.CONTAS_PAGAR.criar)
  @Post()
  create(@Body() data: CreateContasPagarDto): Promise<ContasPagar> {
    return this.contasPagarService.create(data);
  }

  @ApiOperation({ summary: 'Listar contas a pagar' })
  @RequirePermission(PERMISSOES.CONTAS_PAGAR.listar)
  @Get()
  findAll(): Promise<ContasPagar[]> {
    return this.contasPagarService.findAll();
  }

  @ApiOperation({ summary: 'Buscar conta a pagar por ID' })
  @RequirePermission(PERMISSOES.CONTAS_PAGAR.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<ContasPagar> {
    return this.contasPagarService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar conta a pagar' })
  @RequirePermission(PERMISSOES.CONTAS_PAGAR.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateContasPagarDto): Promise<ContasPagar> {
    return this.contasPagarService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover conta a pagar' })
  @RequirePermission(PERMISSOES.CONTAS_PAGAR.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contasPagarService.delete(Number(id));
  }
}
