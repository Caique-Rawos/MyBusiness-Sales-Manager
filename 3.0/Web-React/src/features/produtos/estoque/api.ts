import http from '../../../shared/api/http'
import type { MovimentoEstoque, FiltroEstoque } from './types'

export const estoqueApi = {
  getAll: (filtro: FiltroEstoque) => {
    const params = new URLSearchParams()
    if (filtro.dataInicio) params.set('dataInicio', filtro.dataInicio)
    if (filtro.dataFim) params.set('dataFim', filtro.dataFim)
    if (filtro.idProduto) params.set('idProduto', String(filtro.idProduto))
    return http.get<MovimentoEstoque[]>(`/estoque?${params}`).then(r => r.data)
  },
}
