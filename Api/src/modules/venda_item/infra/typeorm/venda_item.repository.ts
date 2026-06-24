import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVendaItemDto } from '../../application/dto/create-venda_item.dto';
import { UpdateVendaItemDto } from '../../application/dto/update-venda_item.dto';
import { VendaItem } from '../../domain/venda_item';
import { VendaItemRepository } from '../../domain/venda_item.repository';
import { VendaItemOrmEntity } from './venda_item.entity';

@Injectable()
export class VendaItemTypeOrmRepository implements VendaItemRepository {
  constructor(
    @InjectRepository(VendaItemOrmEntity)
    private readonly repository: Repository<VendaItemOrmEntity>,
  ) {}

  async create(data: CreateVendaItemDto): Promise<VendaItem> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<VendaItem[]> {
    return this.repository.find({
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
    });
  }

  async findById(id: number): Promise<VendaItem | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
    });
  }

  async findByVendaId(idVenda: number): Promise<VendaItem[]> {
    return this.repository.find({
      where: { venda: { id: idVenda } },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
      order: { id: 'DESC' },
    });
  }

  async update(id: number, data: UpdateVendaItemDto): Promise<VendaItem> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByProdutoId(idProduto: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idProduto } });
    return count > 0;
  }
}