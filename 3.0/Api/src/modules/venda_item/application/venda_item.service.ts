import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { VendaItem } from '../domain/venda_item';
import {
  VENDA_ITEM_REPOSITORY,
  VendaItemRepository,
} from '../domain/venda_item.repository';
import { CreateVendaItemDto } from './dto/create-venda_item.dto';
import { UpdateVendaItemDto } from './dto/update-venda_item.dto';

@Injectable()
export class VendaItemService {
  constructor(
    @Inject(VENDA_ITEM_REPOSITORY)
    private readonly repository: VendaItemRepository,
    @InjectQueue(QUEUE_NAMES.VENDA) private readonly vendaQueue: Queue,
    @InjectQueue(QUEUE_NAMES.ESTOQUE) private readonly estoqueQueue: Queue,
    private readonly tenantContext: TenantContextService,
  ) {}

  async create(data: CreateVendaItemDto): Promise<VendaItem> {
    const result = await this.repository.create(data);
    const { schema, tenantId } = this.tenantContext.getTenant();
    await this.vendaQueue.add(JOB_NAMES.VENDA.CALCULAR_TOTAL, {
      idVenda: data.idVenda,
      schema,
      tenantId,
    });
    await this.estoqueQueue.add(JOB_NAMES.ESTOQUE.SAIDA, {
      idProduto: data.idProduto,
      quantidade: data.quantidade,
      idVenda: data.idVenda,
      idVendaItem: result.id,
      schema,
      tenantId,
    });
    return result;
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
    const { schema, tenantId } = this.tenantContext.getTenant();
    await this.estoqueQueue.add(JOB_NAMES.ESTOQUE.ESTORNO, { idVendaItem: id, schema, tenantId });
    await this.vendaQueue.add(JOB_NAMES.VENDA.CALCULAR_TOTAL, {
      idVenda: exists.idVenda,
      schema,
      tenantId,
    });
  }

  findByIdVenda(idVenda: number): Promise<VendaItem[]> {
    return this.repository.findByVendaId(idVenda);
  }

  async existsByProdutoId(idProduto: number): Promise<boolean> {
    return this.repository.existsByProdutoId(idProduto);
  }
}
