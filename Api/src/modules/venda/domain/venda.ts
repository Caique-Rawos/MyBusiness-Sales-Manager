import { Cliente } from '../../cliente/domain/cliente';
import { VendaItem } from '../../venda_item/domain/venda_item';

export interface Venda {
  id: number;
  totalVenda: number;
  dataVenda?: Date;
  idCliente: number;
  cliente?: Cliente;
  itens?: VendaItem[];
}