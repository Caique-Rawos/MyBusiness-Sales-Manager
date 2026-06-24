import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lojaApi } from './api'
import type { Loja } from './types'

const QUERY_KEY = ['loja']

export function useLoja() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: lojaApi.getAll })
}

export function useSaveLoja() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ loja, data }: { loja: Loja | undefined; data: Partial<Loja> }) =>
      loja ? lojaApi.update(loja.id, data) : lojaApi.create(data as Omit<Loja, 'id'>),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
