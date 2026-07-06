import { Loja } from './loja';
import { CreateLojaDto } from '../application/dto/create-loja.dto';
import { UpdateLojaDto } from '../application/dto/update-loja.dto';

export const LOJA_REPOSITORY = 'LOJA_REPOSITORY';

export interface LojaRepository {
  create(data: CreateLojaDto): Promise<Loja>;
  findAll(): Promise<Loja[]>;
  findById(id: number): Promise<Loja | null>;
  update(id: number, data: UpdateLojaDto): Promise<Loja>;
  delete(id: number): Promise<void>;
}