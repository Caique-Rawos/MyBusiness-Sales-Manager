import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import axios from 'axios';
import { VendaItemService } from 'src/modules/venda_item/application/venda_item.service';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { Venda } from '../domain/venda';
import { IVendaPrevisao } from '../domain/venda_previsao';
import { VENDA_REPOSITORY, VendaRepository } from '../domain/venda.repository';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';

@Injectable()
export class VendaService {
  constructor(
    @Inject(VENDA_REPOSITORY)
    private readonly repository: VendaRepository,
    private readonly vendaItemService: VendaItemService,
    @InjectQueue(QUEUE_NAMES.ESTOQUE) private readonly estoqueQueue: Queue,
    @InjectQueue(QUEUE_NAMES.CONTAS_RECEBER) private readonly contasReceberQueue: Queue,
    private readonly tenantContext: TenantContextService,
  ) {}

  async create(data: CreateVendaDto): Promise<Venda> {
    const venda = await this.repository.create(data);
    const { schema, tenantId } = this.tenantContext.getTenant();
    await this.contasReceberQueue.add(JOB_NAMES.CONTAS_RECEBER.CRIAR, {
      idVenda: venda.id,
      descricao: 'Lançamento de Venda',
      schema,
      tenantId,
    });
    return venda;
  }

  findAll(): Promise<Venda[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Venda> {
    const venda = await this.repository.findById(id);
    if (!venda) {
      throw new NotFoundException('Venda not found');
    }
    return venda;
  }

  async update(id: number, data: UpdateVendaDto): Promise<Venda> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Venda not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Venda not found');
    }

    const items = await this.vendaItemService.findByIdVenda(id);
    const { schema, tenantId } = this.tenantContext.getTenant();
    for (const item of items) {
      await this.estoqueQueue.add(JOB_NAMES.ESTOQUE.ESTORNO, { idVendaItem: item.id, schema, tenantId });
    }

    await this.repository.delete(id);
  }

  async existsByClienteId(idCliente: number): Promise<boolean> {
    return this.repository.existsByClienteId(idCliente);
  }

  async findVendasFuturas(): Promise<IVendaPrevisao[]> {
    const vendas = await this.repository.findVendasFuturasBase();

    const payload = {
      vendas: vendas.map(
        (v) =>
          ({
            mes: v.mes,
            valorTotal: Number(v.valorTotal),
            quantidadeVendas: Number(v.quantidadeVendas),
            isPrevisao: false,
          }) as IVendaPrevisao,
      ),
    };

    let previsoes: IVendaPrevisao[] = [];

    if (payload.vendas.length > 2) {
      const response = await axios.post(
        'https://my-business-sales-manager-api-py.dlti3g.easypanel.host/forecast',
        payload,
      );

      previsoes = response.data as IVendaPrevisao[];
    }

    return [...payload.vendas, ...previsoes];
  }
}
