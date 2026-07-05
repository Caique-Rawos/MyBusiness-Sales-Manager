import type { Cliente } from '../../clientes/types'

export interface Venda {
  id: number
  totalVenda: string
  dataVenda: string
  cliente: Cliente
}
