import http from '../../../shared/api/http'
import type { ContasPagar } from './types'

export const contasPagarApi = {
  getAll: () => http.get<ContasPagar[]>('/contas-pagar').then(r => r.data),
  create: (data: Record<string, unknown>) => http.post<ContasPagar>('/contas-pagar', data).then(r => r.data),
  update: (id: number, data: Record<string, unknown>) => http.put<ContasPagar>(`/contas-pagar/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/contas-pagar/${id}`).then(r => r.data),
}
