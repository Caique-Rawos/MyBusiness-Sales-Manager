import { Produto } from '../../produto/domain/produto';
import { Venda } from '../../venda/domain/venda';

export interface VendaItem {
  id: number;
  precoUnitario: number;
  desconto?: number;
  quantidade: number;
  subTotal: number;
  idVenda: number;
  idProduto: number;
  venda?: Venda;
  produto?: Produto;
}