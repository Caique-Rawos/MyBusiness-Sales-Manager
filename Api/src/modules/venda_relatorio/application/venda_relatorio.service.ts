import { Inject, Injectable } from '@nestjs/common';
import { LojaService } from '../../loja/application/loja.service';
import { IFiltroRelatorio } from '../domain/filtro_relatorio';
import {
  IVendaClienteRelatorio,
  IVendaDataRelatorio,
  IVendaRelatorio,
} from '../domain/venda_relatorio';
import {
  VENDA_RELATORIO_REPOSITORY,
  VendaRelatorioRepository,
} from '../domain/venda_relatorio.repository';

@Injectable()
export class VendaRelatorioService {
  constructor(
    @Inject(VENDA_RELATORIO_REPOSITORY)
    private readonly repository: VendaRelatorioRepository,
    private readonly lojaService: LojaService,
  ) {}

  async findAll(
    filtro: IFiltroRelatorio,
  ): Promise<{ vendas: IVendaRelatorio[]; totalVendas: number }> {
    const vendas = await this.repository.findAll(filtro);

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
    const vendasPorCliente =
      await this.repository.findAllGroupByCliente(filtro);

    const clienteRelatorio = vendasPorCliente.map((venda) => ({
      idCliente: venda.idCliente,
      nomeCliente: venda.nomeCliente,
      valorVendas: parseFloat(String(venda.valorVendas)),
      quantidadeVendas: parseInt(String(venda.quantidadeVendas), 10),
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

  async findAllGroupByData(filtro: IFiltroRelatorio): Promise<{
    datas: IVendaDataRelatorio[];
    totalVendas: number;
    totalClientes: number;
  }> {
    const vendasPorData = await this.repository.findAllGroupByData(filtro);

    const datas = vendasPorData.map((venda) => ({
      data: venda.data,
      totalVendas: parseFloat(String(venda.totalVendas)),
      contagemCliente: Math.ceil(
        parseInt(String(venda.contagemCliente ?? 0), 10) / 2,
      ),
    }));

    const totalVendas = datas.reduce(
      (sum, venda) => sum + venda.totalVendas,
      0,
    );
    const totalClientes = datas.reduce(
      (sum, venda) => sum + venda.contagemCliente,
      0,
    );

    return { datas, totalVendas, totalClientes };
  }

  async generateCupomFiscal(filtro: { idVenda: number }) {
    const loja = await this.lojaService.findById(1);

    const result = await this.repository.getCupomItens(filtro.idVenda);

    let tributosAproximados = 0;

    result.forEach((item) => {
      const base = parseFloat(item.subtotal ?? item.subTotal ?? '0');
      const icms = (base * parseFloat(item.icms)) / 100;
      const pis = (base * parseFloat(item.pis)) / 100;
      const cofins = (base * parseFloat(item.cofins)) / 100;
      const ipi = (base * parseFloat(item.ipi)) / 100;

      tributosAproximados += icms + pis + cofins + ipi;
    });

    const totalVendas = result.reduce(
      (sum, itens) => sum + parseFloat(itens.subtotal ?? itens.subTotal ?? '0'),
      0,
    );

    return { cupomItens: result, tributosAproximados, totalVendas, loja };
  }
}
