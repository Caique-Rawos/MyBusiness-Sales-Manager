import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { IFiltroRelatorio } from '../../domain/filtro_relatorio';
import { IVendaClienteRelatorio } from '../../domain/venda_relatorio';
import { VendaRelatorioRepository } from '../../domain/venda_relatorio.repository';
import { VendaOrmEntity } from 'src/modules/venda/infra/typeorm/venda.entity';
import { Venda } from 'src/modules/venda/domain/venda';

@Injectable()
export class VendaRelatorioTypeOrmRepository implements VendaRelatorioRepository {
  constructor(
    @InjectRepository(VendaOrmEntity)
    private readonly repository: Repository<VendaOrmEntity>,
  ) {}

  async findAll(filtro: IFiltroRelatorio): Promise<Venda[]> {
    return this.repository.find({
      relations: ['cliente'],
      where: { dataVenda: Between(filtro.dataInicio, filtro.dataFim) },
      order: { dataVenda: 'DESC' },
    });
  }

  async findAllGroupByCliente(
    filtro: IFiltroRelatorio,
  ): Promise<IVendaClienteRelatorio[]> {
    return this.repository
      .createQueryBuilder('venda')
      .leftJoinAndSelect('venda.cliente', 'cliente')
      .select('cliente.id', 'idCliente')
      .addSelect('cliente.nome', 'nomeCliente')
      .addSelect('SUM(venda.totalVenda)', 'valorVendas')
      .addSelect('COUNT(venda.id)', 'quantidadeVendas')
      .where('venda.dataVenda BETWEEN :dataInicio AND :dataFim', {
        dataInicio: filtro.dataInicio,
        dataFim: filtro.dataFim,
      })
      .groupBy('cliente.id')
      .orderBy('"valorVendas"', 'DESC')
      .getRawMany();
  }

  async getCupomItens(idVenda: number): Promise<any[]> {
    return this.repository
      .createQueryBuilder('venda')
      .innerJoin('venda.itens', 'vi')
      .innerJoin('vi.produto', 'p')
      .innerJoin('p.regraFiscal', 'rf')
      .select([
        'vi.precoUnitario - vi.desconto as precoUnitario',
        'vi.quantidade as quantidade',
        'vi.desconto as desconto',
        'vi.subTotal as subTotal',
        'p.codigoDeBarra as codigoDeBarra',
        'p.descricao as descricao',
        'rf.ncm as ncm',
        'rf.icms as icms',
        'rf.pis as pis',
        'rf.cofins as cofins',
        'rf.ipi as ipi',
      ])
      .where('venda.id = :id', { id: idVenda })
      .getRawMany();
  }
}