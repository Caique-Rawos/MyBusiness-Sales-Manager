import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Paginas } from '../domain/paginas';
import {
  PAGINAS_REPOSITORY,
  PaginasRepository,
} from '../domain/paginas.repository';
import { CreatePaginasDto } from './dto/create-paginas.dto';
import { UpdatePaginasDto } from './dto/update-paginas.dto';

@Injectable()
export class PaginasService {
  constructor(
    @Inject(PAGINAS_REPOSITORY)
    private readonly repository: PaginasRepository,
  ) {}

  create(data: CreatePaginasDto): Promise<Paginas> {
    return this.repository.create(data);
  }

  findAll(): Promise<Paginas[]> {
    return this.repository.findAll();
  }

  async findByAlias(alias: string): Promise<Paginas> {
    const paginas = await this.repository.findByAlias(alias);
    if (!paginas) {
      throw new NotFoundException('Paginas not found');
    }
    return paginas;
  }

  async update(alias: string, data: UpdatePaginasDto): Promise<Paginas> {
    const exists = await this.repository.findByAlias(alias);
    if (!exists) {
      throw new NotFoundException('Paginas not found');
    }
    return this.repository.update(exists.id, data);
  }

  async delete(alias: string): Promise<void> {
    const exists = await this.repository.findByAlias(alias);
    if (!exists) {
      throw new NotFoundException('Paginas not found');
    }
    await this.repository.delete(exists.id);
  }
}
