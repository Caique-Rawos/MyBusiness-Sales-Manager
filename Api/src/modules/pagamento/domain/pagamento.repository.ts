import { Pagamento } from './pagamento';
import { CreatePagamentoDto } from '../application/dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../application/dto/update-pagamento.dto';

export const PAGAMENTO_REPOSITORY = 'PAGAMENTO_REPOSITORY';

export interface PagamentoRepository {
  create(data: CreatePagamentoDto): Promise<Pagamento>;
  findAll(): Promise<Pagamento[]>;
  findById(id: number): Promise<Pagamento | null>;
  update(id: number, data: UpdatePagamentoDto): Promise<Pagamento>;
  delete(id: number): Promise<void>;
}