import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { statusPagamentoApi } from './api'

export function useStatusPagamentos() {
  return useQuery({ queryKey: ['status-pagamento'], queryFn: statusPagamentoApi.getAll })
}

export function useCreateStatusPagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: statusPagamentoApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['status-pagamento'] }),
  })
}

export function useUpdateStatusPagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<import('./types').StatusPagamento, 'id'> }) =>
      statusPagamentoApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['status-pagamento'] }),
  })
}

export function useDeleteStatusPagamento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: statusPagamentoApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['status-pagamento'] }),
  })
}
