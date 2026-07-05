import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vendaItemApi } from './api'

export function useVendaItens(idVenda: number) {
  return useQuery({
    queryKey: ['venda-itens', idVenda],
    queryFn: () => vendaItemApi.getByVenda(idVenda),
    enabled: !!idVenda,
  })
}

export function useCreateVendaItem(idVenda: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vendaItemApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venda-itens', idVenda] }),
  })
}

export function useDeleteVendaItem(idVenda: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vendaItemApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venda-itens', idVenda] }),
  })
}
