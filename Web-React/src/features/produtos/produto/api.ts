import http from '../../../shared/api/http'
import type { Produto } from './types'

export const produtoApi = {
  getAll: () => http.get<Produto[]>('/produto').then(r => r.data),
  create: (data: Record<string, unknown>) => http.post<Produto>('/produto', data).then(r => r.data),
  update: (id: number, data: Record<string, unknown>) => http.put<Produto>(`/produto/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/produto/${id}`).then(r => r.data),
}
