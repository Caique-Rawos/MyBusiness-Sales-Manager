import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { produtoApi } from './api'

export function useProdutos() {
  return useQuery({ queryKey: ['produtos'], queryFn: produtoApi.getAll })
}

export function useCreateProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: produtoApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['produtos'] }),
  })
}

export function useUpdateProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      produtoApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['produtos'] }),
  })
}

export function useDeleteProduto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: produtoApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['produtos'] }),
  })
}
