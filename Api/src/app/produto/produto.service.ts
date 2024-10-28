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

  async atualizaEstoque(id_produto: number, quantidade: number): Promise<void> {
    const produto = await this.repository.findOne({
      where: { id: id_produto },
    });

    produto.estoque = produto.estoque - quantidade;
    await this.repository.save(produto);
  }
}
