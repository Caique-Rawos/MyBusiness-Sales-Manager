import type { Produto } from '../../produtos/types'

export interface VendaItem {
  id: number
  produto: Produto
  precoUnitario: string
  desconto: string
  quantidade: string
  subTotal: string
}
