import http from '../../../shared/api/http'
import type { Usuario, CreateUsuarioData } from './types'

export const usuarioApi = {
  getAll: () => http.get<Usuario[]>('/usuarios').then(r => r.data),
  create: (data: CreateUsuarioData) => http.post<Usuario>('/usuarios', data).then(r => r.data),
  updatePapeis: (id: number, papelIds: number[]) =>
    http.put(`/usuarios/${id}/papeis`, { papelIds }).then(r => r.data),
  delete: (id: number) => http.delete(`/usuarios/${id}`).then(r => r.data),
}
