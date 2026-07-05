import http from '../../shared/api/http'
import type { PrevisaoVenda } from './types'

export const dashboardApi = {
  getPrevisao: () => http.get<PrevisaoVenda[]>('/venda/previsao-venda').then(r => r.data),
}
