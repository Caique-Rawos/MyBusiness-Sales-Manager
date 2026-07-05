export type TipoMovimento = 'SAIDA' | 'ESTORNO_SAIDA' | 'ENTRADA'

export interface MovimentoEstoque {
  id: number
  tipo: TipoMovimento
  quantidade: number
  idProduto: number
  produto?: { id: number; descricao: string }
  idVenda?: number
  idVendaItem?: number
  dataMovimento: string
}

export interface FiltroEstoque {
  dataInicio?: string
  dataFim?: string
  idProduto?: number
}
