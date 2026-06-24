import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contasReceberApi } from './api'

export function useContasReceber() {
  return useQuery({ queryKey: ['contas-receber'], queryFn: contasReceberApi.getAll })
}

export function useCreateContasReceber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contasReceberApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-receber'] }),
  })
}

export function useUpdateContasReceber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      contasReceberApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-receber'] }),
  })
}

export function useDeleteContasReceber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: contasReceberApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-receber'] }),
  })
}
