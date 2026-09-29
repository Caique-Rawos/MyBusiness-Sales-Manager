import { Inject, Injectable } from '@nestjs/common';
import { CrachaRfidService } from 'src/modules/cracha_rfid/application/cracha_rfid.service';
import { ControlePonto } from '../domain/controle_ponto';
import {
  CONTROLE_PONTO_REPOSITORY,
  ControlePontoRepository,
} from '../domain/controle_ponto.repository';

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ControlePontoService {
  constructor(
    @Inject(CONTROLE_PONTO_REPOSITORY)
    private readonly repository: ControlePontoRepository,
    private readonly crachaRfidService: CrachaRfidService,
  ) {}

  async baterPonto(hash: string): Promise<ControlePonto> {
    const cracha = await this.crachaRfidService.findByHash(hash);
    return this.repository.create(cracha.id);
  }

  async findUltimos7Dias(idCracha: number): Promise<ControlePonto[]> {
    await this.crachaRfidService.findById(idCracha);
    const desde = new Date(Date.now() - SETE_DIAS_MS);
    return this.repository.findByCrachaSince(idCracha, desde);
  }
}
