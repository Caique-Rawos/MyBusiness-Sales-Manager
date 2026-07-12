import type { Produto } from '../produto/types'

export type TipoMovimento = 'SAIDA' | 'ESTORNO_SAIDA' | 'ENTRADA'

export interface MovimentoEstoque {
  id: number
  tipo: TipoMovimento
  quantidade: number
  idProduto: number
  produto?: Pick<Produto, 'id' | 'descricao'> & Partial<Omit<Produto, 'id' | 'descricao'>>
  idVenda?: number
  idVendaItem?: number
  dataMovimento: string
}

export interface FiltroEstoque {
  dataInicio?: string
  dataFim?: string
  idProduto?: number
}
