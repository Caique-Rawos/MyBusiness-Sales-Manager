import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VendaItemService } from 'src/modules/venda_item/application/venda_item.service';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { PRODUTO_REPOSITORY, ProdutoRepository } from '../domain/produto.repository';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from '../domain/produto';

@Injectable()
export class ProdutoService {
  constructor(
    @Inject(PRODUTO_REPOSITORY)
    private readonly repository: ProdutoRepository,
    private readonly vendaItemService: VendaItemService,
    @InjectQueue(QUEUE_NAMES.ESTOQUE) private readonly estoqueQueue: Queue,
    private readonly tenantContext: TenantContextService,
  ) {}

  async create(data: CreateProdutoDto): Promise<Produto> {
    const produto = await this.repository.create(data);
    if (Number(produto.estoque) > 0) {
      const { schema, tenantId } = this.tenantContext.getTenant();
      await this.estoqueQueue.add(JOB_NAMES.ESTOQUE.ENTRADA, {
        idProduto: produto.id,
        quantidade: produto.estoque,
        motivo: 'Cadastro de produto',
        schema,
        tenantId,
      });
    }
    return produto;
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

    const referenced = await this.vendaItemService.existsByProdutoId(id);
    if (referenced) {
      throw new ConflictException('Produto possui itens de venda vinculados e não pode ser removido');
    }

    await this.repository.delete(id);
  }

  async existsByRegraFiscalId(idRegraFiscal: number): Promise<boolean> {
    return this.repository.existsByRegraFiscalId(idRegraFiscal);
  }

  async existsByCategoriaId(idCategoria: number): Promise<boolean> {
    return this.repository.existsByCategoriaId(idCategoria);
  }

  async ajustarEstoque(id: number, delta: number): Promise<void> {
    const produto = await this.repository.findById(id);
    if (!produto) return;
    await this.repository.updateEstoque(id, Number(produto.estoque) + delta);
  }
}
