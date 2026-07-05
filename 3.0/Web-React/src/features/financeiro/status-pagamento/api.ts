import http from '../../../shared/api/http'
import type { StatusPagamento } from './types'

export const statusPagamentoApi = {
  getAll: () => http.get<StatusPagamento[]>('/status-pagamento').then(r => r.data),
  create: (data: Omit<StatusPagamento, 'id'>) => http.post<StatusPagamento>('/status-pagamento', data).then(r => r.data),
  update: (id: number, data: Omit<StatusPagamento, 'id'>) => http.put<StatusPagamento>(`/status-pagamento/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/status-pagamento/${id}`).then(r => r.data),
}
