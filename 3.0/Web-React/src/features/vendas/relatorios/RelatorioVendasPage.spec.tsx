import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { RelatorioVendasPage } from './RelatorioVendasPage'
import { relatorioApi } from '../venda/api'

vi.mock('../venda/api', () => ({
  vendaApi: { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() },
  relatorioApi: { getByRange: vi.fn(), getByCliente: vi.fn(), getByData: vi.fn() },
}))

function renderPage(query: string) {
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter initialEntries={[`/relatorio/vendas${query}`]}>
      <QueryClientProvider client={queryClient}>
        <RelatorioVendasPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('RelatorioVendasPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should show the empty message when there are no vendas in the period', async () => {
    vi.mocked(relatorioApi.getByRange).mockResolvedValue({ vendas: [], totalVendas: 0 })
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    expect(await screen.findByText('Nenhuma venda no período.')).toBeInTheDocument()
    expect(relatorioApi.getByRange).toHaveBeenCalledWith('2026-01-01', '2026-01-31')
  })

  it('should render the vendas and the period total', async () => {
    vi.mocked(relatorioApi.getByRange).mockResolvedValue({
      vendas: [{ idVenda: 1, valorVenda: 100, dataVenda: '2026-01-05T00:00:00.000Z', nomeCliente: 'Fulano', idCliente: 1 }],
      totalVendas: 100,
    })
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    expect(await screen.findByText('Fulano')).toBeInTheDocument()
    expect(screen.getByText('Total do período: R$ 100,00')).toBeInTheDocument()
  })

  it('should call window.print when clicking "Imprimir"', async () => {
    vi.mocked(relatorioApi.getByRange).mockResolvedValue({ vendas: [], totalVendas: 0 })
    const printSpy = vi.fn()
    vi.stubGlobal('print', printSpy)
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    fireEvent.click(await screen.findByRole('button', { name: /imprimir/i }))
    expect(printSpy).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })

  it('should not query and show the empty message when the query params are missing', async () => {
    vi.mocked(relatorioApi.getByRange).mockResolvedValue({ vendas: [], totalVendas: 0 })
    renderPage('')

    await screen.findByText('Nenhuma venda no período.')
    expect(relatorioApi.getByRange).not.toHaveBeenCalled()
  })
})
