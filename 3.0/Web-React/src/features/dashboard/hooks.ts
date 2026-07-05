import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from './api'

export function useDashboard() {
  return useQuery({ queryKey: ['previsao-venda'], queryFn: dashboardApi.getPrevisao })
}
