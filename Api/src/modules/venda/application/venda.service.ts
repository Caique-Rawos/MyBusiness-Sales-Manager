import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ContasReceberService } from '../../contas_receber/application/contas_receber.service';
import { Venda } from '../domain/venda';
import { IVendaPrevisao } from '../domain/venda_previsao';
import { VENDA_REPOSITORY, VendaRepository } from '../domain/venda.repository';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';

@Injectable()
export class VendaService {
  constructor(
    @Inject(VENDA_REPOSITORY)
    private readonly repository: VendaRepository,
    private readonly contasReceberService: ContasReceberService,
  ) {}

  create(data: CreateVendaDto): Promise<Venda> {
    return this.repository.create(data);
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
    await this.repository.delete(id);
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

  async atualizaTotal(vendaUpdateDto: VendaUpdateDto): Promise<void> {
    const venda = await this.repository.findById(vendaUpdateDto.id_venda);
    if (!venda) {
      throw new NotFoundException('Venda not found');
    }

    await this.repository.update(venda.id, { totalVenda: vendaUpdateDto.total });
    await this.contasReceberService.atualizaTotal(vendaUpdateDto);
  }
}