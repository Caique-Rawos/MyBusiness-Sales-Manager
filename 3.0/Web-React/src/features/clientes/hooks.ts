import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clienteApi } from './api'
import type { Cliente } from './types'

const QUERY_KEY = ['clientes']

export function useClientes() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: clienteApi.getAll })
}

export function useCreateCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clienteApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useUpdateCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Cliente> }) =>
      clienteApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useDeleteCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clienteApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
