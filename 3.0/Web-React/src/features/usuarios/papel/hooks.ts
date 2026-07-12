import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { papelApi, permissaoApi } from './api'
import type { CreatePapelData, UpdatePapelData } from './types'

const QUERY_KEY = ['papeis']
const PERMISSOES_QUERY_KEY = ['permissoes']

export function usePapeis() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: papelApi.getAll })
}

export function usePermissoes() {
  return useQuery({ queryKey: PERMISSOES_QUERY_KEY, queryFn: permissaoApi.getAll })
}

export function useCreatePapel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePapelData) => papelApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdatePapel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePapelData }) => papelApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeletePapel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => papelApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
