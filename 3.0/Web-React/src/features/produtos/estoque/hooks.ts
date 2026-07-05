import { useQuery } from '@tanstack/react-query'
import { estoqueApi } from './api'
import type { FiltroEstoque } from './types'

export function useMovimentosEstoque(filtro: FiltroEstoque) {
  return useQuery({
    queryKey: ['estoque', filtro],
    queryFn: () => estoqueApi.getAll(filtro),
  })
}
