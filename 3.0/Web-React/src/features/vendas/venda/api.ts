import http from '../../../shared/api/http'
import type { Venda } from './types'

export interface VendaRelatorioItem {
  idVenda: number
  valorVenda: number
  dataVenda: string
  nomeCliente: string
  idCliente: number
}

export interface RelatorioVendasResponse {
  vendas: VendaRelatorioItem[]
  totalVendas: number
}

export interface ClienteRelatorioItem {
  idCliente: number
  nomeCliente: string
  valorVendas: number
  quantidadeVendas: number
}

export interface RelatorioClienteResponse {
  vendas: ClienteRelatorioItem[]
  totalVendas: number
  quantidadeTotal: number
}

export interface DataRelatorioItem {
  data: string
  totalVendas: number
  contagemCliente: number
}

export interface RelatorioDataResponse {
  datas: DataRelatorioItem[]
  totalVendas: number
  totalClientes: number
}

export const vendaApi = {
  getAll: () => http.get<Venda[]>('/venda').then(r => r.data),
  create: (data: Record<string, unknown>) => http.post<Venda>('/venda', data).then(r => r.data),
  delete: (id: number) => http.delete(`/venda/${id}`).then(r => r.data),
}

export const relatorioApi = {
  getByRange: (dataInicio: string, dataFim: string) =>
    http.get<RelatorioVendasResponse>(`/venda-relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`).then(r => r.data),
  getByCliente: (dataInicio: string, dataFim: string) =>
    http.get<RelatorioClienteResponse>(`/venda-relatorio/cliente?dataInicio=${dataInicio}&dataFim=${dataFim}`).then(r => r.data),
  getByData: (dataInicio: string, dataFim: string) =>
    http.get<RelatorioDataResponse>(`/venda-relatorio/data?dataInicio=${dataInicio}&dataFim=${dataFim}`).then(r => r.data),
}
