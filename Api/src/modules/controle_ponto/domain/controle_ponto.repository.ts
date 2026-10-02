import { ControlePonto } from './controle_ponto';

export const CONTROLE_PONTO_REPOSITORY = 'CONTROLE_PONTO_REPOSITORY';

export interface ControlePontoRepository {
  create(idCracha: number): Promise<ControlePonto>;
  findByCrachaSince(idCracha: number, desde: Date): Promise<ControlePonto[]>;
}
