import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { RelatorioClientePage } from './RelatorioClientePage'
import { relatorioApi } from '../venda/api'

vi.mock('../venda/api', () => ({
  vendaApi: { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() },
  relatorioApi: { getByRange: vi.fn(), getByCliente: vi.fn(), getByData: vi.fn() },
}))

function renderPage(query: string) {
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter initialEntries={[`/relatorio/cliente${query}`]}>
      <QueryClientProvider client={queryClient}>
        <RelatorioClientePage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('RelatorioClientePage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should show the empty message when there are no vendas in the period', async () => {
    vi.mocked(relatorioApi.getByCliente).mockResolvedValue({ vendas: [], totalVendas: 0, quantidadeTotal: 0 })
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    expect(await screen.findByText('Nenhuma venda no período.')).toBeInTheDocument()
    expect(relatorioApi.getByCliente).toHaveBeenCalledWith('2026-01-01', '2026-01-31')
  })

  it('should render the resumo por cliente and the period total', async () => {
    vi.mocked(relatorioApi.getByCliente).mockResolvedValue({
      vendas: [{ idCliente: 1, nomeCliente: 'Fulano', valorVendas: 100, quantidadeVendas: 2 }],
      totalVendas: 100,
      quantidadeTotal: 2,
    })
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    expect(await screen.findByText('Fulano')).toBeInTheDocument()
    expect(screen.getByText('Total do período: R$ 100,00')).toBeInTheDocument()
  })

  it('should call window.print when clicking "Imprimir"', async () => {
    vi.mocked(relatorioApi.getByCliente).mockResolvedValue({ vendas: [], totalVendas: 0, quantidadeTotal: 0 })
    const printSpy = vi.fn()
    vi.stubGlobal('print', printSpy)
    renderPage('?dataInicio=2026-01-01&dataFinal=2026-01-31')

    fireEvent.click(await screen.findByRole('button', { name: /imprimir/i }))
    expect(printSpy).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })

  it('should not query and show the empty message when the query params are missing', async () => {
    vi.mocked(relatorioApi.getByCliente).mockResolvedValue({ vendas: [], totalVendas: 0, quantidadeTotal: 0 })
    renderPage('')

    await screen.findByText('Nenhuma venda no período.')
    expect(relatorioApi.getByCliente).not.toHaveBeenCalled()
  })
})
