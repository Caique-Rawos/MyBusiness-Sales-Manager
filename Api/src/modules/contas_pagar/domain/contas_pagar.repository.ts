import { ContasPagar } from './contas_pagar';
import { CreateContasPagarDto } from '../application/dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from '../application/dto/update-contas_pagar.dto';

export const CONTAS_PAGAR_REPOSITORY = 'CONTAS_PAGAR_REPOSITORY';

export interface ContasPagarRepository {
  create(data: CreateContasPagarDto): Promise<ContasPagar>;
  findAll(): Promise<ContasPagar[]>;
  findById(id: number): Promise<ContasPagar | null>;
  existsByPagamentoId(idPagamento: number): Promise<boolean>;
  existsByStatusPagamentoId(idStatusPagamento: number): Promise<boolean>;
  update(id: number, data: UpdateContasPagarDto): Promise<ContasPagar>;
  delete(id: number): Promise<void>;
}