import { Injectable } from '@nestjs/common';
import { ProdutoEntity } from './entity/produtos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private repository: Repository<ProdutoEntity>,
  ) {}

  async create(data: ProdutoEntity): Promise<ProdutoEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ProdutoEntity[]> {
    return this.repository.find({
      relations: ['categoria'],
      order: {
        id: 'DESC',
      },
    });
  }
}
