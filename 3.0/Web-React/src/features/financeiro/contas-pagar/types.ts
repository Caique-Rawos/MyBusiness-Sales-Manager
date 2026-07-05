import type { Pagamento } from '../pagamento/types'
import type { StatusPagamento } from '../status-pagamento/types'

export interface ContasPagar {
  id: number
  descricao: string
  valorTotal: string
  valorPago: string
  dataVencimento: string
  pagamento: Pagamento
  statusPagamento: StatusPagamento
}
