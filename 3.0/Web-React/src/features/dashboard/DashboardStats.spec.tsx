import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardStats } from './DashboardStats'
import type { PrevisaoVenda } from './types'

describe('DashboardStats', () => {
  it('should show zeroed stats when there is no historico or previsao', () => {
    render(<DashboardStats historico={[]} previsoes={[]} />)
    const valores = screen.getAllByText('R$ 0,00')
    expect(valores).toHaveLength(3)
  })

  it('should sum the historico into "Receita Total" and compute month-over-month growth', () => {
    const historico: PrevisaoVenda[] = [
      { mes: '11-2025', valorTotal: 100, quantidadeVendas: 1 },
      { mes: '12-2025', valorTotal: 150, quantidadeVendas: 2 },
    ]
    render(<DashboardStats historico={historico} previsoes={[]} />)

    expect(screen.getByText('R$ 250,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    expect(screen.getByText(/▲ 50\.0% vs mês anterior/)).toBeInTheDocument()
  })

  it('should show a downward arrow when growth is negative', () => {
    const historico: PrevisaoVenda[] = [
      { mes: '11-2025', valorTotal: 200, quantidadeVendas: 1 },
      { mes: '12-2025', valorTotal: 100, quantidadeVendas: 1 },
    ]
    render(<DashboardStats historico={historico} previsoes={[]} />)
    expect(screen.getByText(/▼ 50\.0% vs mês anterior/)).toBeInTheDocument()
  })

  it('should show the previsao value and growth vs the last historico month', () => {
    const historico: PrevisaoVenda[] = [{ mes: '12-2025', valorTotal: 100, quantidadeVendas: 1 }]
    const previsoes: PrevisaoVenda[] = [{ mes: '01-2026', valorTotal: 120, quantidadeVendas: 1, isPrevisao: true }]
    render(<DashboardStats historico={historico} previsoes={previsoes} />)

    expect(screen.getByText('R$ 120,00')).toBeInTheDocument()
    expect(screen.getByText(/▲ 20\.0% vs último mês/)).toBeInTheDocument()
  })

  it('should show a downward arrow when the previsao is lower than the last historico month', () => {
    const historico: PrevisaoVenda[] = [{ mes: '12-2025', valorTotal: 100, quantidadeVendas: 1 }]
    const previsoes: PrevisaoVenda[] = [{ mes: '01-2026', valorTotal: 50, quantidadeVendas: 1, isPrevisao: true }]
    render(<DashboardStats historico={historico} previsoes={previsoes} />)

    expect(screen.getByText(/▼ 50\.0% vs último mês/)).toBeInTheDocument()
  })

  it('should treat growth as 0 when the previous month had no revenue', () => {
    const historico: PrevisaoVenda[] = [
      { mes: '11-2025', valorTotal: 0, quantidadeVendas: 0 },
      { mes: '12-2025', valorTotal: 100, quantidadeVendas: 1 },
    ]
    render(<DashboardStats historico={historico} previsoes={[]} />)

    expect(screen.getByText(/▲ 0\.0% vs mês anterior/)).toBeInTheDocument()
  })
})
