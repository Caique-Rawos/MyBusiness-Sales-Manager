import { StatusPagamento } from './status_pagamento';
import { CreateStatusPagamentoDto } from '../application/dto/create-status_pagamento.dto';
import { UpdateStatusPagamentoDto } from '../application/dto/update-status_pagamento.dto';

export const STATUS_PAGAMENTO_REPOSITORY = 'STATUS_PAGAMENTO_REPOSITORY';

export interface StatusPagamentoRepository {
  create(data: CreateStatusPagamentoDto): Promise<StatusPagamento>;
  findAll(): Promise<StatusPagamento[]>;
  findById(id: number): Promise<StatusPagamento | null>;
  update(id: number, data: UpdateStatusPagamentoDto): Promise<StatusPagamento>;
  delete(id: number): Promise<void>;
}