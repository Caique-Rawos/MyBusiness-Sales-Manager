import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pagamentoApi } from './api'

export function usePagamentos() {
  return useQuery({ queryKey: ['pagamentos'], queryFn: pagamentoApi.getAll })
}

export function useCreatePagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: pagamentoApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pagamentos'] }),
  })
}

export function useUpdatePagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<import('./types').Pagamento, 'id'> }) =>
      pagamentoApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pagamentos'] }),
  })
}

export function useDeletePagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: pagamentoApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pagamentos'] }),
  })
}
