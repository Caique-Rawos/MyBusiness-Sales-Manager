import http from '../../../shared/api/http'
import type { RegraFiscal } from './types'

export const regraFiscalApi = {
  getAll: () => http.get<RegraFiscal[]>('/regra-fiscal').then(r => r.data),
  create: (data: Omit<RegraFiscal, 'id'>) => http.post<RegraFiscal>('/regra-fiscal', data).then(r => r.data),
  update: (id: number, data: Partial<RegraFiscal>) => http.put<RegraFiscal>(`/regra-fiscal/${id}`, data).then(r => r.data),
  delete: (id: number) => http.delete(`/regra-fiscal/${id}`).then(r => r.data),
}
