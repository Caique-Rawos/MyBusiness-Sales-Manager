import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuarioApi } from './api'
import type { CreateUsuarioData } from './types'

const QUERY_KEY = ['usuarios']

export function useUsuarios() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: usuarioApi.getAll })
}

export function useCreateUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUsuarioData) => usuarioApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateUsuarioPapeis() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, papelIds }: { id: number; papelIds: number[] }) =>
      usuarioApi.updatePapeis(id, papelIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuarioApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
