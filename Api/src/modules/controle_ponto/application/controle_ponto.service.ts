import { Inject, Injectable } from '@nestjs/common';
import { CrachaRfidService } from '../../cracha_rfid/application/cracha_rfid.service';
import { ControlePonto } from '../domain/controle_ponto';
import {
  CONTROLE_PONTO_REPOSITORY,
  ControlePontoRepository,
} from '../domain/controle_ponto.repository';
import { ContagemClienteService } from 'src/modules/contagem_cliente/application/contagem_cliente.service';

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ControlePontoService {
  constructor(
    @Inject(CONTROLE_PONTO_REPOSITORY)
    private readonly repository: ControlePontoRepository,
    private readonly crachaRfidService: CrachaRfidService,
    private readonly contagemClienteService: ContagemClienteService,
  ) {}

  async baterPonto(hash: string): Promise<ControlePonto> {
    const cracha = await this.crachaRfidService.findByHash(hash);
    const result = await this.repository.create(cracha.id);
    if (!(await this.contagemClienteService.subtract())) {
      console.error('Error occurred while subtracting contagem cliente');
    }
    return result;
  }

  async findUltimos7Dias(idCracha: number): Promise<ControlePonto[]> {
    await this.crachaRfidService.findById(idCracha);
    const desde = new Date(Date.now() - SETE_DIAS_MS);
    return this.repository.findByCrachaSince(idCracha, desde);
  }
}
