import type { Pagamento } from '../pagamento/types'
import type { StatusPagamento } from '../status-pagamento/types'

export interface ContasReceber {
  id: number
  descricao: string
  valorTotal: string
  valorPago: string
  dataVencimento: string
  idVenda?: number
  pagamento: Pagamento
  statusPagamento: StatusPagamento
}
