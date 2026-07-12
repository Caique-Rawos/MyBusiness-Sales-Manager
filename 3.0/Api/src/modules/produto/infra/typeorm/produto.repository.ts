import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreateProdutoDto } from '../../application/dto/create-produto.dto';
import { UpdateProdutoDto } from '../../application/dto/update-produto.dto';
import { Produto } from '../../domain/produto';
import { ProdutoRepository } from '../../domain/produto.repository';
import { ProdutoOrmEntity } from './produto.entity';

@Injectable()
export class ProdutoTypeOrmRepository implements ProdutoRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<ProdutoOrmEntity> {
    return this.tenantContext.getRepository(ProdutoOrmEntity);
  }

  async create(data: CreateProdutoDto): Promise<Produto> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Produto[]> {
    return this.repository.find({
      relations: ['categoria', 'regraFiscal'],
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Produto | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['categoria', 'regraFiscal'],
    });
  }

  async update(id: number, data: UpdateProdutoDto): Promise<Produto> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
      relations: ['categoria', 'regraFiscal'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByRegraFiscalId(idRegraFiscal: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idRegraFiscal } });
    return count > 0;
  }

  async existsByCategoriaId(idCategoria: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idCategoria } });
    return count > 0;
  }

  async updateEstoque(id: number, novoEstoque: number): Promise<void> {
    await this.repository.update(id, { estoque: novoEstoque });
  }
}