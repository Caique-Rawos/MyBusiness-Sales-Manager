import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { VendaService } from '../application/venda.service';
import { CreateVendaDto } from '../application/dto/create-venda.dto';
import { UpdateVendaDto } from '../application/dto/update-venda.dto';
import { Venda } from '../domain/venda';
import { IVendaPrevisao } from '../domain/venda_previsao';

@ApiTags('Vendas')
@Controller('venda')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @ApiOperation({ summary: 'Criar venda' })
  @RequirePermission(PERMISSOES.VENDA.criar)
  @Post()
  create(@Body() data: CreateVendaDto): Promise<Venda> {
    return this.vendaService.create(data);
  }

  @ApiOperation({ summary: 'Listar vendas' })
  @RequirePermission(PERMISSOES.VENDA.listar)
  @Get()
  findAll(): Promise<Venda[]> {
    return this.vendaService.findAll();
  }

  @ApiOperation({ summary: 'Previsão de vendas futuras (ML)' })
  @RequirePermission(PERMISSOES.VENDA.listar)
  @Get('previsao-venda')
  findVendasFuturas(): Promise<IVendaPrevisao[]> {
    return this.vendaService.findVendasFuturas();
  }

  @ApiOperation({ summary: 'Buscar venda por ID' })
  @RequirePermission(PERMISSOES.VENDA.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<Venda> {
    return this.vendaService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar venda' })
  @RequirePermission(PERMISSOES.VENDA.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateVendaDto): Promise<Venda> {
    return this.vendaService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover venda' })
  @RequirePermission(PERMISSOES.VENDA.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.vendaService.delete(Number(id));
  }
}
