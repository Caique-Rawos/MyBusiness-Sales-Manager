import http from '../../../shared/api/http'
import type { Papel, CreatePapelData, UpdatePapelData, PermissaoResumo } from './types'

export const papelApi = {
  getAll: () => http.get<Papel[]>('/papeis').then(r => r.data),
  create: (data: CreatePapelData) => http.post<Papel>('/papeis', data).then(r => r.data),
  update: (id: number, data: UpdatePapelData) => http.put<Papel>(`/papeis/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/papeis/${id}`).then(r => r.data),
}

export const permissaoApi = {
  getAll: () => http.get<PermissaoResumo[]>('/permissoes').then(r => r.data),
}
