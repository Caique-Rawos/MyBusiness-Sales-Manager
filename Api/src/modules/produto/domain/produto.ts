import { Categoria } from '../../categoria/domain/categoria';
import { RegraFiscal } from '../../regra_fiscal/domain/regra_fiscal';

export interface Produto {
  id: number;
  descricao: string;
  codigoDeBarra?: string;
  valorCusto: number;
  valorVenda: number;
  estoque: number;
  unidade: string;
  image?: string;
  idCategoria: number;
  idRegraFiscal?: number;
  categoria?: Categoria;
  regraFiscal?: RegraFiscal;
}