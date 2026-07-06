import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { ContasReceberService } from '../application/contas_receber.service';
import { CreateContasReceberDto } from '../application/dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from '../application/dto/update-contas_receber.dto';
import { ContasReceber } from '../domain/contas_receber';

@ApiTags('Contas a Receber')
@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @ApiOperation({ summary: 'Criar conta a receber' })
  @RequirePermission(PERMISSOES.CONTAS_RECEBER.criar)
  @Post()
  create(@Body() data: CreateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.create(data);
  }

  @ApiOperation({ summary: 'Listar contas a receber' })
  @RequirePermission(PERMISSOES.CONTAS_RECEBER.listar)
  @Get()
  findAll(): Promise<ContasReceber[]> {
    return this.contasReceberService.findAll();
  }

  @ApiOperation({ summary: 'Buscar conta a receber por ID' })
  @RequirePermission(PERMISSOES.CONTAS_RECEBER.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<ContasReceber> {
    return this.contasReceberService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar conta a receber' })
  @RequirePermission(PERMISSOES.CONTAS_RECEBER.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateContasReceberDto): Promise<ContasReceber> {
    return this.contasReceberService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover conta a receber' })
  @RequirePermission(PERMISSOES.CONTAS_RECEBER.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.contasReceberService.delete(Number(id));
  }
}
