import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoService } from '../../produto/application/produto.service';
import { VendaService } from '../../venda/application/venda.service';
import { VENDA_ITEM_REPOSITORY, VendaItemRepository } from '../domain/venda_item.repository';
import { CreateVendaItemDto } from './dto/create-venda_item.dto';
import { UpdateVendaItemDto } from './dto/update-venda_item.dto';
import { VendaItem } from '../domain/venda_item';

@Injectable()
export class VendaItemService {
  constructor(
    @Inject(VENDA_ITEM_REPOSITORY)
    private readonly repository: VendaItemRepository,
    private readonly vendaService: VendaService,
    private readonly produtoService: ProdutoService,
  ) {}

  create(data: CreateVendaItemDto): Promise<VendaItem> {
    return this.repository.create(data);
  }

  findAll(): Promise<VendaItem[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<VendaItem> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException('VendaItem not found');
    }
    return item;
  }

  async update(id: number, data: UpdateVendaItemDto): Promise<VendaItem> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('VendaItem not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('VendaItem not found');
    }
    await this.repository.delete(id);
  }

  findByIdVenda(idVenda: number): Promise<VendaItem[]> {
    return this.repository.findByVendaId(idVenda);
  }

  async novoTotalVenda(idVenda: number): Promise<void> {
    const vendaItens = await this.findByIdVenda(idVenda);
    const totalSubtotais = vendaItens.reduce(
      (sum, item) => sum + Number(item.subTotal),
      0,
    );

    await this.vendaService.atualizaTotal({
      id_venda: idVenda,
      total: totalSubtotais,
    });
  }

  async atualizaEstoqueProduto(
    idProduto: number,
    quantidade: number,
  ): Promise<void> {
    await this.produtoService.atualizaEstoque(idProduto, quantidade);
  }
}