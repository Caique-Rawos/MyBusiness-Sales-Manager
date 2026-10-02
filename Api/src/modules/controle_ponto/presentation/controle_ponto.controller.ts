import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

@Controller('controle-ponto')
export class ControlePontoController {
  constructor(private readonly controlePontoService: ControlePontoService) {}

  @Post()
  async baterPonto(@Body() data: BaterPontoDto): Promise<BaterPontoResposta> {
    const { id, idCracha, timestamp } = await this.controlePontoService.baterPonto(data.hash);
    return { id, idCracha, timestamp };
  }

  @Get()
  async findUltimos7Dias(@Query() query: ConsultarPontoDto): Promise<PontoResposta[]> {
    const idCracha = Number(query.idCracha);
    const pontos = await this.controlePontoService.findUltimos7Dias(idCracha);
    return pontos.map(({ timestamp }) => ({ timestamp }));
  }
}