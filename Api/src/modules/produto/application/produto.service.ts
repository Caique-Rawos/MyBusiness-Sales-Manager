import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUTO_REPOSITORY, ProdutoRepository } from '../domain/produto.repository';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from '../domain/produto';

@Injectable()
export class ProdutoService {
  constructor(
    @Inject(PRODUTO_REPOSITORY)
    private readonly repository: ProdutoRepository,
  ) {}

  create(data: CreateProdutoDto): Promise<Produto> {
    return this.repository.create(data);
  }

  findAll(): Promise<Produto[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.repository.findById(id);
    if (!produto) {
      throw new NotFoundException('Produto not found');
    }
    return produto;
  }

  async update(id: number, data: UpdateProdutoDto): Promise<Produto> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Produto not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Produto not found');
    }
    await this.repository.delete(id);
  }

  async atualizaEstoque(idProduto: number, quantidade: number): Promise<void> {
    const produto = await this.repository.findById(idProduto);
    if (!produto) {
      throw new NotFoundException('Produto not found');
    }
    const novoEstoque = Number(produto.estoque) - Number(quantidade);
    await this.repository.update(idProduto, { estoque: novoEstoque });
  }
}