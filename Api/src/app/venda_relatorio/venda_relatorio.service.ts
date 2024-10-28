import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
}
