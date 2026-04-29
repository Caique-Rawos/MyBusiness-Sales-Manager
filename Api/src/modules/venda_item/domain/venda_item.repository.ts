import { VendaItem } from './venda_item';
import { CreateVendaItemDto } from '../application/dto/create-venda_item.dto';
import { UpdateVendaItemDto } from '../application/dto/update-venda_item.dto';

export const VENDA_ITEM_REPOSITORY = 'VENDA_ITEM_REPOSITORY';

export interface VendaItemRepository {
  create(data: CreateVendaItemDto): Promise<VendaItem>;
  findAll(): Promise<VendaItem[]>;
  findById(id: number): Promise<VendaItem | null>;
  findByVendaId(idVenda: number): Promise<VendaItem[]>;
  update(id: number, data: UpdateVendaItemDto): Promise<VendaItem>;
  delete(id: number): Promise<void>;
}