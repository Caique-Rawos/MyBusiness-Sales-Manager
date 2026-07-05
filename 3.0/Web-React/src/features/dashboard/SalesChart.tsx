import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { PrevisaoVenda } from './types'
import { Card } from '../../shared/components/ui/Card'
import { formatCurrency } from '../../shared/lib/utils'

interface SalesChartProps {
  data: PrevisaoVenda[]
}

interface ChartPoint {
  mes: string
  historico: number | null
  previsao: number | null
  qtdHistorico: number | null
  qtdPrevisao: number | null
}

function formatMes(mes: string) {
  const [m, y] = mes.split('-')
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${meses[Number(m) - 1]}/${y.slice(2)}`
}

export function SalesChart({ data }: SalesChartProps) {
  const primeiraPrevisaoIdx = data.findIndex(d => d.isPrevisao)

  const chartData: ChartPoint[] = data.map((d, i) => {
    const isTransicao = i === primeiraPrevisaoIdx - 1
    return {
      mes: formatMes(d.mes),
      historico: !d.isPrevisao || isTransicao ? d.valorTotal : null,
      previsao: d.isPrevisao || isTransicao ? d.valorTotal : null,
      qtdHistorico: !d.isPrevisao || isTransicao ? d.quantidadeVendas : null,
      qtdPrevisao: d.isPrevisao || isTransicao ? d.quantidadeVendas : null,
    }
  })

  const mesTransicao = primeiraPrevisaoIdx > 0 ? formatMes(data[primeiraPrevisaoIdx - 1].mes) : null

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span className="font-medium">
              {entry.name.startsWith('Qtd') ? entry.value : formatCurrency(entry.value ?? 0)}
            </span>
          </p>
        ))}
      </div>
    )
  }

  return (
    <Card title="Histórico e Previsão de Vendas">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="valor"
              tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              width={60}
            />
            <YAxis
              yAxisId="qtd"
              orientation="right"
              tick={{ fontSize: 11 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={() => (
                <div className="flex justify-center gap-5 text-xs text-gray-600 mt-1">
                  {[
                    { label: 'Histórico', color: '#3b82f6', dashed: false },
                    { label: 'Qtd. Histórico', color: '#10b981', dashed: false },
                    { label: 'Previsão', color: '#f59e0b', dashed: true },
                    { label: 'Qtd. Previsão', color: '#84cc16', dashed: true },
                  ].map(({ label, color, dashed }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <svg width="20" height="10">
                        <line
                          x1="0" y1="5" x2="20" y2="5"
                          stroke={color}
                          strokeWidth="2"
                          strokeDasharray={dashed ? '5 3' : 'none'}
                        />
                      </svg>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            />
            {mesTransicao && (
              <ReferenceLine
                x={mesTransicao}
                yAxisId="valor"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{ value: 'Previsão', position: 'insideTopRight', fontSize: 11, fill: '#94a3b8', offset: 4 }}
              />
            )}
            <Area
              yAxisId="valor"
              type="monotone"
              dataKey="historico"
              name="Histórico"
              stroke="#3b82f6"
              fill="#3b82f615"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls={false}
            />
            <Line
              yAxisId="qtd"
              type="monotone"
              dataKey="qtdHistorico"
              name="Qtd. Histórico"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              yAxisId="valor"
              type="monotone"
              dataKey="previsao"
              name="Previsão"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3 }}
              connectNulls={false}
            />
            <Line
              yAxisId="qtd"
              type="monotone"
              dataKey="qtdPrevisao"
              name="Qtd. Previsão"
              stroke="#84cc16"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
