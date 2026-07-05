import { MovimentoEstoque, TipoMovimento } from './movimento_estoque';

export const MOVIMENTO_ESTOQUE_REPOSITORY = 'MOVIMENTO_ESTOQUE_REPOSITORY';

export interface RegistrarMovimentoDto {
  tipo: TipoMovimento;
  quantidade: number;
  idProduto: number;
  motivo?: string;
  idVenda?: number;
  idVendaItem?: number;
}

export interface MovimentoEstoqueFiltro {
  dataInicio?: Date;
  dataFim?: Date;
  idProduto?: number;
}

export interface MovimentoEstoqueRepository {
  registrar(data: RegistrarMovimentoDto): Promise<MovimentoEstoque>;
  findSaidaPorVendaItem(idVendaItem: number): Promise<MovimentoEstoque | null>;
  findAll(filtro: MovimentoEstoqueFiltro): Promise<MovimentoEstoque[]>;
}
