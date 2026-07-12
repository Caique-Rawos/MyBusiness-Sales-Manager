import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { DashboardPage } from './index'
import { dashboardApi } from './api'
import type { PrevisaoVenda } from './types'

vi.mock('./api', () => ({ dashboardApi: { getPrevisao: vi.fn() } }))
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  }
})

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
    </QueryClientProvider>,
  )
}

describe('DashboardPage', () => {
  it('should show a loading spinner while fetching', () => {
    vi.mocked(dashboardApi.getPrevisao).mockReturnValue(new Promise(() => {}))
    const { container } = renderPage()
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should render the stats and the chart once data loads', async () => {
    const data: PrevisaoVenda[] = [{ mes: '01-2026', valorTotal: 100, quantidadeVendas: 1 }]
    vi.mocked(dashboardApi.getPrevisao).mockResolvedValue(data)
    renderPage()

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    // "Receita Total" e "Ultimo Mes" coincidem (so tem 1 mes de historico)
    expect(await screen.findAllByText('R$ 100,00')).toHaveLength(2)
    expect(screen.getByText('Histórico e Previsão de Vendas')).toBeInTheDocument()
  })
})
