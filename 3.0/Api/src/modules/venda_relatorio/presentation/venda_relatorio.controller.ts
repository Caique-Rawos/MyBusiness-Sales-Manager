import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VendaRelatorioService } from '../application/venda_relatorio.service';
import { IFiltroRelatorio } from '../domain/filtro_relatorio';
import {
  IVendaClienteRelatorio,
  IVendaDataRelatorio,
  IVendaRelatorio,
} from '../domain/venda_relatorio';

@ApiTags('Relatórios de Venda')
@Controller('venda-relatorio')
export class VendaRelatorioController {
  constructor(private readonly vendaRelatorioService: VendaRelatorioService) {}

  @ApiOperation({ summary: 'Relatório geral de vendas por período' })
  @ApiQuery({ name: 'dataInicio', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'dataFim', required: true, type: String, example: '2024-12-31' })
  @Get()
  findAll(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ): Promise<{ vendas: IVendaRelatorio[]; totalVendas: number }> {
    const filtro: IFiltroRelatorio = {
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
    };
    return this.vendaRelatorioService.findAll(filtro);
  }

  @ApiOperation({ summary: 'Relatório de vendas agrupado por cliente' })
  @ApiQuery({ name: 'dataInicio', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'dataFim', required: true, type: String, example: '2024-12-31' })
  @Get('cliente')
  findAllGroupByCliente(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ): Promise<{
    vendas: IVendaClienteRelatorio[];
    totalVendas: number;
    quantidadeTotal: number;
  }> {
    const filtro: IFiltroRelatorio = {
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
    };
    return this.vendaRelatorioService.findAllGroupByCliente(filtro);
  }

  @ApiOperation({ summary: 'Relatório de vendas agrupado por data' })
  @ApiQuery({ name: 'dataInicio', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'dataFim', required: true, type: String, example: '2024-12-31' })
  @Get('data')
  findAllGroupByData(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ): Promise<{
    datas: IVendaDataRelatorio[];
    totalVendas: number;
    totalClientes: number;
  }> {
    const filtro: IFiltroRelatorio = {
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
    };
    return this.vendaRelatorioService.findAllGroupByData(filtro);
  }

  @ApiOperation({ summary: 'Gerar cupom fiscal de uma venda' })
  @Get('cupom_fiscal/:idVenda')
  generateCupomFiscal(@Param('idVenda') idVenda: string) {
    return this.vendaRelatorioService.generateCupomFiscal({ idVenda: Number(idVenda) });
  }
}
