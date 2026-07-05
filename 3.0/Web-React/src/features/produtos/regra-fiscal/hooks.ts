import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { regraFiscalApi } from './api'
import type { RegraFiscal } from './types'

export function useRegrasFiscais() {
  return useQuery({ queryKey: ['regras-fiscais'], queryFn: regraFiscalApi.getAll })
}

export function useCreateRegraFiscal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: regraFiscalApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regras-fiscais'] }),
  })
}

export function useUpdateRegraFiscal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<RegraFiscal, 'id'> }) =>
      regraFiscalApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regras-fiscais'] }),
  })
}

export function useDeleteRegraFiscal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: regraFiscalApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regras-fiscais'] }),
  })
}
