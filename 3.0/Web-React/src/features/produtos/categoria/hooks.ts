import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriaApi } from './api'

export function useCategorias() {
  return useQuery({ queryKey: ['categorias'], queryFn: categoriaApi.getAll })
}

export function useCreateCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoriaApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

export function useUpdateCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<import('./types').Categoria, 'id'> }) =>
      categoriaApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}

export function useDeleteCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriaApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  })
}
