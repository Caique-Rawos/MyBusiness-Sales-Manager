import { DollarSign, TrendingUp, Eye } from 'lucide-react'
import type { PrevisaoVenda } from './types'
import { Card } from '../../shared/components/ui/Card'
import { formatCurrency } from '../../shared/lib/utils'

interface DashboardStatsProps {
  historico: PrevisaoVenda[]
  previsoes: PrevisaoVenda[]
}

function calcGrowth(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function DashboardStats({ historico, previsoes }: DashboardStatsProps) {
  const totalReceita = historico.reduce((acc, h) => acc + h.valorTotal, 0)
  const ultimoMes = historico.length > 0 ? historico[historico.length - 1] : null
  const penultimoMes = historico.length > 1 ? historico[historico.length - 2] : null
  const proximaPrevisao = previsoes.length > 0 ? previsoes[0] : null

  const ultimoMesGrowth = ultimoMes && penultimoMes
    ? calcGrowth(ultimoMes.valorTotal, penultimoMes.valorTotal)
    : 0

  const previsaoGrowth = proximaPrevisao && ultimoMes
    ? calcGrowth(proximaPrevisao.valorTotal, ultimoMes.valorTotal)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-100 p-2.5">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Receita Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalReceita)}</p>
            <p className="mt-1 text-xs text-gray-400">Histórico acumulado</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-green-100 p-2.5">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Último Mês</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {ultimoMes ? formatCurrency(ultimoMes.valorTotal) : 'R$ 0,00'}
            </p>
            <p className={`mt-1 text-xs font-medium ${ultimoMesGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {ultimoMesGrowth >= 0 ? '▲' : '▼'} {Math.abs(ultimoMesGrowth).toFixed(1)}% vs mês anterior
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-amber-100 p-2.5">
            <Eye className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Previsão Próximo Mês</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {proximaPrevisao ? formatCurrency(proximaPrevisao.valorTotal) : 'R$ 0,00'}
            </p>
            <p className={`mt-1 text-xs font-medium ${previsaoGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {previsaoGrowth >= 0 ? '▲' : '▼'} {Math.abs(previsaoGrowth).toFixed(1)}% vs último mês
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
