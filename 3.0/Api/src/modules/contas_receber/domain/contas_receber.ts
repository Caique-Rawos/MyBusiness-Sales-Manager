import { Pagamento } from '../../pagamento/domain/pagamento';
import { StatusPagamento } from '../../status_pagamento/domain/status_pagamento';
import { Venda } from '../../venda/domain/venda';

export interface ContasReceber {
  id: number;
  descricao: string;
  valorTotal: number;
  valorPago?: number;
  dataVencimento?: Date;
  idPagamento?: number;
  idStatusPagamento?: number;
  idVenda?: number;
  pagamento?: Pagamento;
  statusPagamento?: StatusPagamento;
  venda?: Venda;
}