import { Venda } from './venda';
import { CreateVendaDto } from '../application/dto/create-venda.dto';
import { UpdateVendaDto } from '../application/dto/update-venda.dto';
import { IVendaPrevisao } from './venda_previsao';

export const VENDA_REPOSITORY = 'VENDA_REPOSITORY';

export interface VendaRepository {
  create(data: CreateVendaDto): Promise<Venda>;
  findAll(): Promise<Venda[]>;
  findById(id: number): Promise<Venda | null>;
  update(id: number, data: UpdateVendaDto): Promise<Venda>;
  delete(id: number): Promise<void>;
  findVendasFuturasBase(): Promise<IVendaPrevisao[]>;
  existsByClienteId(idCliente: number): Promise<boolean>;
  updateTotal(id: number, total: number): Promise<void>;
}