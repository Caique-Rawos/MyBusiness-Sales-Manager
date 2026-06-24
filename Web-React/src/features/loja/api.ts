import http from '../../shared/api/http'
import type { Loja } from './types'

export const lojaApi = {
  getAll: () => http.get<Loja[]>('/loja').then(r => r.data),
  create: (data: Omit<Loja, 'id'>) => http.post<Loja>('/loja', data).then(r => r.data),
  update: (id: number, data: Partial<Loja>) => http.put<Loja>(`/loja/${id}`, data).then(r => r.data),
}
