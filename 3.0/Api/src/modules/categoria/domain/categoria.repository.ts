import { Categoria } from './categoria';
import { CreateCategoriaDto } from '../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../application/dto/update-categoria.dto';

export const CATEGORIA_REPOSITORY = 'CATEGORIA_REPOSITORY';

export interface CategoriaRepository {
  create(data: CreateCategoriaDto): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findById(id: number): Promise<Categoria | null>;
  update(id: number, data: UpdateCategoriaDto): Promise<Categoria>;
  delete(id: number): Promise<void>;
}