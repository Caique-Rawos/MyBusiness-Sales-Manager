import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PERMISSOES } from '../../auth/application/permission-catalog';
import { RequirePermission } from '../../auth/presentation/decorators/require-permission.decorator';
import { BaterPontoDto } from '../application/dto/bater-ponto.dto';
import { ConsultarPontoDto } from '../application/dto/consultar-ponto.dto';
import { ControlePontoService } from '../application/controle_ponto.service';

export interface BaterPontoResposta {
  id: number;
  idCracha: number;
  timestamp: Date;
}

export interface PontoResposta {
  timestamp: Date;
}

@ApiTags('Controle de Ponto')
@Controller('controle-ponto')
export class ControlePontoController {
  constructor(private readonly controlePontoService: ControlePontoService) {}

  @ApiOperation({ summary: 'Bater ponto a partir do hash do crachá' })
  @RequirePermission(PERMISSOES.CONTROLE_PONTO.criar)
  @Post()
  async baterPonto(@Body() data: BaterPontoDto): Promise<BaterPontoResposta> {
    const { id, idCracha, timestamp } = await this.controlePontoService.baterPonto(data.hash);
    return { id, idCracha, timestamp };
  }

  @ApiOperation({ summary: 'Pontos dos últimos 7 dias de um crachá' })
  @RequirePermission(PERMISSOES.CONTROLE_PONTO.listar)
  @Get()
  async findUltimos7Dias(@Query() query: ConsultarPontoDto): Promise<PontoResposta[]> {
    const pontos = await this.controlePontoService.findUltimos7Dias(query.idCracha);
    return pontos.map(({ timestamp }) => ({ timestamp }));
  }
}
