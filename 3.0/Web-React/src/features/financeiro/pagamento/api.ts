import http from '../../../shared/api/http'
import type { Pagamento } from './types'

export const pagamentoApi = {
  getAll: () => http.get<Pagamento[]>('/pagamento').then(r => r.data),
  create: (data: Omit<Pagamento, 'id'>) => http.post<Pagamento>('/pagamento', data).then(r => r.data),
  update: (id: number, data: Omit<Pagamento, 'id'>) => http.put<Pagamento>(`/pagamento/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/pagamento/${id}`).then(r => r.data),
}
