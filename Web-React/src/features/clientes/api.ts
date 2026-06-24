import http from '../../shared/api/http'
import type { Cliente } from './types'

export const clienteApi = {
  getAll: () => http.get<Cliente[]>('/cliente').then(r => r.data),
  getById: (id: number) => http.get<Cliente>(`/cliente/${id}`).then(r => r.data),
  create: (data: Omit<Cliente, 'id'>) => http.post<Cliente>('/cliente', data).then(r => r.data),
  update: (id: number, data: Partial<Cliente>) => http.put<Cliente>(`/cliente/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/cliente/${id}`).then(r => r.data),
}
