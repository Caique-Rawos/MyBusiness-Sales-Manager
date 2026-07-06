import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { RegraFiscalService } from '../application/regra_fiscal.service';
import { CreateRegraFiscalDto } from '../application/dto/create-regra_fiscal.dto';
import { UpdateRegraFiscalDto } from '../application/dto/update-regra_fiscal.dto';
import { RegraFiscal } from '../domain/regra_fiscal';

@ApiTags('Regras Fiscais')
@Controller('regra-fiscal')
export class RegraFiscalController {
  constructor(private readonly regraFiscalService: RegraFiscalService) {}

  @ApiOperation({ summary: 'Criar regra fiscal' })
  @RequirePermission(PERMISSOES.REGRA_FISCAL.criar)
  @Post()
  create(@Body() data: CreateRegraFiscalDto): Promise<RegraFiscal> {
    return this.regraFiscalService.create(data);
  }

  @ApiOperation({ summary: 'Listar regras fiscais' })
  @RequirePermission(PERMISSOES.REGRA_FISCAL.listar)
  @Get()
  findAll(): Promise<RegraFiscal[]> {
    return this.regraFiscalService.findAll();
  }

  @ApiOperation({ summary: 'Buscar regra fiscal por ID' })
  @RequirePermission(PERMISSOES.REGRA_FISCAL.listar)
  @Get(':id')
  findById(@Param('id') id: string): Promise<RegraFiscal> {
    return this.regraFiscalService.findById(Number(id));
  }

  @ApiOperation({ summary: 'Atualizar regra fiscal' })
  @RequirePermission(PERMISSOES.REGRA_FISCAL.editar)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRegraFiscalDto): Promise<RegraFiscal> {
    return this.regraFiscalService.update(Number(id), data);
  }

  @ApiOperation({ summary: 'Remover regra fiscal' })
  @RequirePermission(PERMISSOES.REGRA_FISCAL.deletar)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.regraFiscalService.delete(Number(id));
  }
}
