import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SalesChart } from './SalesChart'
import type { PrevisaoVenda } from './types'

// ResponsiveContainer depende de ResizeObserver/layout real, que o jsdom nao fornece --
// substitui por um wrapper com tamanho fixo, tecnica padrao pra testar componentes recharts.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  }
})

describe('SalesChart', () => {
  it('should render the card title with only historico data', () => {
    const data: PrevisaoVenda[] = [{ mes: '01-2026', valorTotal: 100, quantidadeVendas: 1 }]
    render(<SalesChart data={data} />)
    expect(screen.getByText('Histórico e Previsão de Vendas')).toBeInTheDocument()
  })

  it('should render without crashing when there is no data', () => {
    render(<SalesChart data={[]} />)
    expect(screen.getByText('Histórico e Previsão de Vendas')).toBeInTheDocument()
  })

  it('should render without crashing when data mixes historico and previsao', () => {
    const data: PrevisaoVenda[] = [
      { mes: '12-2025', valorTotal: 100, quantidadeVendas: 1 },
      { mes: '01-2026', valorTotal: 120, quantidadeVendas: 2, isPrevisao: true },
    ]
    render(<SalesChart data={data} />)
    expect(screen.getByText('Histórico e Previsão de Vendas')).toBeInTheDocument()
  })
})
