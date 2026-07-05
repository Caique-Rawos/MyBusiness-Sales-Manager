import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from '../../application/dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../../application/dto/update-categoria.dto';
import { Categoria } from '../../domain/categoria';
import { CategoriaRepository } from '../../domain/categoria.repository';
import { CategoriaOrmEntity } from './categoria.entity';

@Injectable()
export class CategoriaTypeOrmRepository implements CategoriaRepository {
  constructor(
    @InjectRepository(CategoriaOrmEntity)
    private readonly repository: Repository<CategoriaOrmEntity>,
  ) {}

  async create(data: CreateCategoriaDto): Promise<Categoria> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Categoria[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<Categoria | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateCategoriaDto): Promise<Categoria> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}