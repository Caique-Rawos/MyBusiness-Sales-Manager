import http from '../../../shared/api/http'
import type { Categoria } from './types'

export const categoriaApi = {
  getAll: () => http.get<Categoria[]>('/categoria').then(r => r.data),
  create: (data: Omit<Categoria, 'id'>) => http.post<Categoria>('/categoria', data).then(r => r.data),
  update: (id: number, data: Omit<Categoria, 'id'>) => http.put<Categoria>(`/categoria/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/categoria/${id}`).then(r => r.data),
}
