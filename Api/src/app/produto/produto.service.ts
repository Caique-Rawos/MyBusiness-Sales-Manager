import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoEntity } from './entity/produtos.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private repository: Repository<ProdutoEntity>,
  ) {}

  create(data: ProdutoEntity): Promise<ProdutoEntity> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  findAll(): Promise<ProdutoEntity[]> {
    return this.repository.find({
      relations: ['categoria', 'regraFiscal'],
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
