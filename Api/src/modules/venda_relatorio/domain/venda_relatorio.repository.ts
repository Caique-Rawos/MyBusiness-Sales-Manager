import { IFiltroRelatorio } from './filtro_relatorio';
import {
  IVendaClienteRelatorio,
  IVendaDataRelatorio,
  IVendaRelatorio,
} from './venda_relatorio';
import { Venda } from '../../venda/domain/venda';

export const VENDA_RELATORIO_REPOSITORY = 'VENDA_RELATORIO_REPOSITORY';

export interface VendaRelatorioRepository {
  findAll(filtro: IFiltroRelatorio): Promise<Venda[]>;
  findAllGroupByCliente(
    filtro: IFiltroRelatorio,
  ): Promise<IVendaClienteRelatorio[]>;
  findAllGroupByData(filtro: IFiltroRelatorio): Promise<IVendaDataRelatorio[]>;
  getCupomItens(idVenda: number): Promise<any[]>;
}
