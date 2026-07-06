import { CreatePaginasDto } from '../application/dto/create-paginas.dto';
import { UpdatePaginasDto } from '../application/dto/update-paginas.dto';
import { Paginas } from './paginas';

export const PAGINAS_REPOSITORY = 'PAGINAS_REPOSITORY';

export interface PaginasRepository {
  create(data: CreatePaginasDto): Promise<Paginas>;
  findAll(): Promise<Paginas[]>;
  findByAlias(alias: string): Promise<Paginas | null>;
  update(id: number, data: UpdatePaginasDto): Promise<Paginas>;
  delete(id: number): Promise<void>;
}
