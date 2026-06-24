import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vendaApi, relatorioApi } from './api'

export function useVendas() {
  return useQuery({ queryKey: ['vendas'], queryFn: vendaApi.getAll })
}

export function useCreateVenda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vendaApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendas'] }),
  })
}

export function useDeleteVenda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vendaApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendas'] }),
  })
}

export function useRelatorio(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['relatorio-vendas', dataInicio, dataFim],
    queryFn: () => relatorioApi.getByRange(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
  })
}

export function useRelatorioCliente(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['relatorio-cliente', dataInicio, dataFim],
    queryFn: () => relatorioApi.getByCliente(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
  })
}

export function useRelatorioData(dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['relatorio-data', dataInicio, dataFim],
    queryFn: () => relatorioApi.getByData(dataInicio, dataFim),
    enabled: !!dataInicio && !!dataFim,
  })
}
