import { RegraFiscal } from './regra_fiscal';
import { CreateRegraFiscalDto } from '../application/dto/create-regra_fiscal.dto';
import { UpdateRegraFiscalDto } from '../application/dto/update-regra_fiscal.dto';

export const REGRA_FISCAL_REPOSITORY = 'REGRA_FISCAL_REPOSITORY';

export interface RegraFiscalRepository {
  create(data: CreateRegraFiscalDto): Promise<RegraFiscal>;
  findAll(): Promise<RegraFiscal[]>;
  findById(id: number): Promise<RegraFiscal | null>;
  update(id: number, data: UpdateRegraFiscalDto): Promise<RegraFiscal>;
  delete(id: number): Promise<void>;
}