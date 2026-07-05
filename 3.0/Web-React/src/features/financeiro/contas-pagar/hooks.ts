import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contasPagarApi } from './api'

export function useContasPagar() {
  return useQuery({ queryKey: ['contas-pagar'], queryFn: contasPagarApi.getAll })
}

export function useCreateContasPagar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contasPagarApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-pagar'] }),
  })
}

export function useUpdateContasPagar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      contasPagarApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-pagar'] }),
  })
}

export function useDeleteContasPagar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contasPagarApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-pagar'] }),
  })
}
