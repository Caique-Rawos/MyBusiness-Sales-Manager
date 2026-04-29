import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLojaDto } from '../../application/dto/create-loja.dto';
import { UpdateLojaDto } from '../../application/dto/update-loja.dto';
import { Loja } from '../../domain/loja';
import { LojaRepository } from '../../domain/loja.repository';
import { LojaOrmEntity } from './loja.entity';

@Injectable()
export class LojaTypeOrmRepository implements LojaRepository {
  constructor(
    @InjectRepository(LojaOrmEntity)
    private readonly repository: Repository<LojaOrmEntity>,
  ) {}

  async create(data: CreateLojaDto): Promise<Loja> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Loja[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<Loja | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateLojaDto): Promise<Loja> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}