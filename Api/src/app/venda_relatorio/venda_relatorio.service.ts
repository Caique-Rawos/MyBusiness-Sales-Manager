import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LojaService } from '../loja/loja.service';
import { VendaEntity } from '../venda/entity/venda.entity';
import { IFiltroRelatorio } from './interface/filtro_relatorio.interface';
import {
  IVendaClienteRelatorio,
  IVendaRelatorio,
} from './interface/venda_relatorio.interface';

@Injectable()
export class VendaRelatorioService {
  constructor(
    @InjectRepository(VendaEntity)
    private repository: Repository<VendaEntity>,
    private lojaService: LojaService,
  ) {}

  async findAll(
    filtro: IFiltroRelatorio,
  ): Promise<{ vendas: IVendaRelatorio[]; totalVendas: number }> {
    const vendas = await this.repository.find({
      relations: ['cliente'],
      where: {
        dataVenda: Between(filtro.dataInicio, filtro.dataFim),
      },
      order: {
        dataVenda: 'DESC',
      },
    });

    const vendasRelatorio = vendas.map((venda) => ({
      idVenda: venda.id,
      valorVenda: Number(venda.totalVenda),
      dataVenda: venda.dataVenda,
      nomeCliente: venda.cliente.nome,
      idCliente: venda.cliente.id,
    }));

    const totalVendas = vendasRelatorio.reduce(
      (sum, venda) => sum + venda.valorVenda,
      0,
    );

    return {
      vendas: vendasRelatorio,
      totalVendas,
    };
  }

  async findAllGroupByCliente(filtro: IFiltroRelatorio): Promise<{
    vendas: IVendaClienteRelatorio[];
    totalVendas: number;
    quantidadeTotal: number;
  }> {
    const vendasPorCliente = await this.repository
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

    const clienteRelatorio = vendasPorCliente.map((venda) => ({
      idCliente: venda.idCliente,
      nomeCliente: venda.nomeCliente,
      valorVendas: parseFloat(venda.valorVendas),
      quantidadeVendas: parseInt(venda.quantidadeVendas, 10),
    }));

    const totalVendas = clienteRelatorio.reduce(
      (sum, venda) => sum + venda.valorVendas,
      0,
    );

    const quantidadeTotal = clienteRelatorio.reduce(
      (sum, venda) => sum + venda.quantidadeVendas,
      0,
    );

    return { vendas: clienteRelatorio, totalVendas, quantidadeTotal };
  }

  async generateCupomFiscal(filtro: { idVenda: number }) {
    const loja = await this.lojaService.findOnly();

    const result = await this.repository
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
      .where('venda.id = :id', { id: filtro.idVenda })
      .getRawMany();

    let tributosAproximados = 0;

    result.forEach((item) => {
      const base = parseFloat(item.subtotal);
      const icms = (base * parseFloat(item.icms)) / 100;
      const pis = (base * parseFloat(item.pis)) / 100;
      const cofins = (base * parseFloat(item.cofins)) / 100;
      const ipi = (base * parseFloat(item.ipi)) / 100;

      tributosAproximados += icms + pis + cofins + ipi;
    });

    const totalVendas = result.reduce(
      (sum, itens) => sum + parseFloat(itens.subtotal),
      0,
    );

    return { cupomItens: result, tributosAproximados, totalVendas, loja };
  }
}
