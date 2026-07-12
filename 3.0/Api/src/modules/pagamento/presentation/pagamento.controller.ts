import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { PagamentoService } from '../application/pagamento.service';
import { CreatePagamentoDto } from '../application/dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../application/dto/update-pagamento.dto';
import { Pagamento } from '../domain/pagamento';

@ApiTags('Formas de Pagamento')
@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @ApiOperation({ summary: 'Criar forma de pagamento' })
  @RequirePermission(PERMISSOES.PAGAMENTO.criar)
  @Post()
  create(@Body() data: CreatePagamentoDto): Promise<Pagamento> {
    return this.pagamentoService.create(data);
  }

  @ApiOperation({ summary: 'Listar formas de pagamento' })
  @RequirePermission(PERMISSOES.PAGAMENTO.listar)
  @Get()
  findAll(): Promise<Pagamento[]> {
    return this.pagamentoService.findAll();
  }

  @ApiOperation({ summary: 'Buscar forma de pagamento por ID' })
  @RequirePermission(PERMISSOES.PAGAMENTO.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Pagamento> {
    return this.pagamentoService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar forma de pagamento' })
  @RequirePermission(PERMISSOES.PAGAMENTO.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdatePagamentoDto): Promise<Pagamento> {
    return this.pagamentoService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover forma de pagamento' })
  @RequirePermission(PERMISSOES.PAGAMENTO.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.pagamentoService.delete(Number(id));
  }
}
