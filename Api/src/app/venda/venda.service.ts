import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';
import { VendaEntity } from './entity/venda.entity';
import { IVendaPrevisao } from './interface/venda_previsao.interface';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(VendaEntity)
    private repository: Repository<VendaEntity>,
    private contasReceberService: ContasReceberService,
  ) {}

  async create(data: VendaEntity): Promise<VendaEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<VendaEntity[]> {
    return this.repository.find({
      relations: ['cliente'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findVendasFuturas(): Promise<any[]> {
    const query = this.repository
      .createQueryBuilder('venda')
      .select(
        `TO_CHAR(DATE_TRUNC('month', venda."dataVenda"), 'MM-YYYY')`,
        'mes',
      )
      .addSelect('COUNT(*)', 'quantidadeVendas')
      .addSelect(`SUM(venda."totalVenda")`, 'valorTotal')
      .where(`venda."dataVenda" >= NOW() - INTERVAL '24 months'`)
      .groupBy(`DATE_TRUNC('month', venda."dataVenda")`)
      .orderBy(`DATE_TRUNC('month', venda."dataVenda")`, 'ASC');

    const vendas = await query.getRawMany<IVendaPrevisao>();

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

    let previsoes = [];

    if (payload.vendas.length > 2) {
      const response = await axios.post(
        'http://localhost:5001/forecast',
        payload,
      );

      previsoes = response.data as IVendaPrevisao[];
    }

    return [...payload.vendas, ...previsoes];
  }

  async atualizaTotal(vendaUpdateDto: VendaUpdateDto) {
    const venda = await this.repository.findOne({
      where: { id: vendaUpdateDto.id_venda },
    });
    venda.totalVenda = vendaUpdateDto.total;
    await this.repository.save(venda);

    this.contasReceberService.atualizaTotal(vendaUpdateDto);
    return;
  }
}
