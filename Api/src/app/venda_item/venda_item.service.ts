import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaItemEntity } from './entity/venda_item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendaItemService {
  constructor(
    @InjectRepository(VendaItemEntity)
    private repository: Repository<VendaItemEntity>,
  ) {}

  async create(data: VendaItemEntity): Promise<VendaItemEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<VendaItemEntity[]> {
    return this.repository.find({
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
    });
  }
}
