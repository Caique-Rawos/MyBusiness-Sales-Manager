import { Injectable } from '@nestjs/common';
import { ProdutoEntity } from './entity/produtos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async findAll(): Promise<ProdutoEntity[]> {
    return this.produtoRepository.find({ relations: ['categoria'] });
  }
}
