import { ContasReceber } from './contas_receber';
import { CreateContasReceberDto } from '../application/dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from '../application/dto/update-contas_receber.dto';

export const CONTAS_RECEBER_REPOSITORY = 'CONTAS_RECEBER_REPOSITORY';

export interface ContasReceberRepository {
  create(data: CreateContasReceberDto): Promise<ContasReceber>;
  findAll(): Promise<ContasReceber[]>;
  findById(id: number): Promise<ContasReceber | null>;
  findByVendaId(idVenda: number): Promise<ContasReceber | null>;
  existsByPagamentoId(idPagamento: number): Promise<boolean>;
  existsByStatusPagamentoId(idStatusPagamento: number): Promise<boolean>;
  update(id: number, data: UpdateContasReceberDto): Promise<ContasReceber>;
  delete(id: number): Promise<void>;
}