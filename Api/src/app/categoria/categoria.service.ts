import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './entity/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private repository: Repository<CategoriaEntity>,
  ) {}

  async create(data: CategoriaEntity): Promise<CategoriaEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<CategoriaEntity[]> {
    return this.repository.find();
  }
}
