import http from '../../../shared/api/http'
import type { ContasReceber } from './types'

export const contasReceberApi = {
  getAll: () => http.get<ContasReceber[]>('/contas-receber').then(r => r.data),
  create: (data: Record<string, unknown>) => http.post<ContasReceber>('/contas-receber', data).then(r => r.data),
  update: (id: number, data: Record<string, unknown>) => http.put<ContasReceber>(`/contas-receber/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/contas-receber/${id}`).then(r => r.data),
}
