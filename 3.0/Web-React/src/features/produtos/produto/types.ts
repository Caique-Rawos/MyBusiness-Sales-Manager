import type { Categoria } from '../categoria/types'
import type { RegraFiscal } from '../regra-fiscal/types'

export interface Produto {
  id: number
  descricao: string
  codigoDeBarra?: string
  valorCusto: string
  valorVenda: string
  estoque: number
  unidade?: string
  categoria: Categoria
  regraFiscal: RegraFiscal
}
