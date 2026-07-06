import { useDashboard } from './hooks'
import { DashboardStats } from './DashboardStats'
import { SalesChart } from './SalesChart'

export function DashboardPage() {
  const { data = [], isLoading } = useDashboard()

  const historico = data.filter(d => !d.isPrevisao)
  const previsoes = data.filter(d => d.isPrevisao)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <DashboardStats historico={historico} previsoes={previsoes} />
      <SalesChart data={data} />
    </div>
  )
}
