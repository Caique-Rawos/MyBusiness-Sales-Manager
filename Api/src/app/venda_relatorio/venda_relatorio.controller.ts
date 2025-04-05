import { Body, Controller, Post } from '@nestjs/common';
import { IFiltroRelatorio } from './interface/filtro_relatorio.interface';
import {
  IVendaClienteRelatorio,
  IVendaRelatorio,
} from './interface/venda_relatorio.interface';
import { VendaRelatorioService } from './venda_relatorio.service';

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

  @Post('cupom_fiscal')
  generateCupomFiscal(@Body() filtro: { idVenda: number }) {
    return this.vendaRelatorioService.generateCupomFiscal(filtro);
  }
}
