import { Cliente } from './cliente';
import { CreateClienteDto } from '../application/dto/create-cliente.dto';
import { UpdateClienteDto } from '../application/dto/update-cliente.dto';

export const CLIENTE_REPOSITORY = 'CLIENTE_REPOSITORY';

export interface ClienteRepository {
  create(data: CreateClienteDto): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(id: number): Promise<Cliente | null>;
  update(id: number, data: UpdateClienteDto): Promise<Cliente>;
  delete(id: number): Promise<void>;
}