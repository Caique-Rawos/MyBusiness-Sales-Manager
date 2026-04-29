import { Body, Controller, Post } from '@nestjs/common';
import { IFiltroRelatorio } from '../domain/filtro_relatorio';
import {
  IVendaClienteRelatorio,
  IVendaDataRelatorio,
  IVendaRelatorio,
} from '../domain/venda_relatorio';
import { VendaRelatorioService } from '../application/venda_relatorio.service';

@Controller('venda_relatorio')
export class VendaRelatorioController {
  constructor(private readonly vendaRelatorioService: VendaRelatorioService) {}

  @Post()
  findAll(
    @Body() filtro: IFiltroRelatorio,
  ): Promise<{ vendas: IVendaRelatorio[]; totalVendas: number }> {
    return this.vendaRelatorioService.findAll(filtro);
  }

  @Post('cliente')
  findAllGroupByCliente(@Body() filtro: IFiltroRelatorio): Promise<{
    vendas: IVendaClienteRelatorio[];
    totalVendas: number;
    quantidadeTotal: number;
  }> {
    return this.vendaRelatorioService.findAllGroupByCliente(filtro);
  }

  @Post('data')
  findAllGroupByData(@Body() filtro: IFiltroRelatorio): Promise<{
    datas: IVendaDataRelatorio[];
    totalVendas: number;
    totalClientes: number;
  }> {
    return this.vendaRelatorioService.findAllGroupByData(filtro);
  }

  @Post('cupom_fiscal')
  generateCupomFiscal(@Body() filtro: { idVenda: number }) {
    return this.vendaRelatorioService.generateCupomFiscal(filtro);
  }
}
