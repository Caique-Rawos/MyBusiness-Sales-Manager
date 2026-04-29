import { Pagamento } from '../../pagamento/domain/pagamento';
import { StatusPagamento } from '../../status_pagamento/domain/status_pagamento';

export interface ContasPagar {
  id: number;
  descricao: string;
  valorTotal: number;
  valorPago?: number;
  dataVencimento?: Date;
  idPagamento: number;
  idStatusPagamento: number;
  pagamento?: Pagamento;
  statusPagamento?: StatusPagamento;
}