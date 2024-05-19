import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaItemEntity } from './entity/venda_item.entity';
import { Repository } from 'typeorm';
import { VendaService } from '../venda/venda.service';

@Injectable()
export class VendaItemService {
  constructor(
    @InjectRepository(VendaItemEntity)
    private repository: Repository<VendaItemEntity>,
    private vendaService: VendaService,
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

  async findByIdVenda(id_venda: number): Promise<VendaItemEntity[]> {
    return this.repository.find({
      where: { venda: { id: id_venda } },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
      order: {
        id: 'DESC',
      },
    });
  }

  async NovoTotalVenda(id_venda: number): Promise<number> {
    const vendaItens = await this.findByIdVenda(id_venda);
    let totalSubtotais: number = 0;

    vendaItens.forEach((vendaItem) => {
      totalSubtotais += Number(vendaItem.subTotal);
    });

    this.vendaService.atualizaTotal({
      id_venda: id_venda,
      total: totalSubtotais,
    });

    return totalSubtotais;
  }
}
