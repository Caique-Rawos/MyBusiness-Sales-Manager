import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { EstoquePage } from './EstoquePage'
import { estoqueApi } from './api'
import { produtoApi } from '../produto/api'
import type { MovimentoEstoque } from './types'

vi.mock('./api', () => ({ estoqueApi: { getAll: vi.fn() } }))
vi.mock('../produto/api', () => ({ produtoApi: { getAll: vi.fn() } }))

const movimento: MovimentoEstoque = {
  id: 1,
  tipo: 'SAIDA',
  quantidade: 2,
  idProduto: 1,
  produto: {
    id: 1,
    descricao: 'Produto A',
    valorCusto: '10.00',
    valorVenda: '15.00',
    estoque: 8,
    categoria: { id: 1, descricao: 'Categoria A' },
    regraFiscal: {
      id: 1,
      descricao: 'Regra A',
      ncm: '1234.56.78',
      icms: 0,
      pis: 0,
      cofins: 0,
      ipi: 0,
    },
  },
  idVenda: 5,
  dataMovimento: '2026-01-01T00:00:00.000Z',
}

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <EstoquePage />
    </QueryClientProvider>,
  )
}

describe('EstoquePage', () => {
  it('should render movimentos with the tipo badge, produto descricao and venda reference', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([movimento])
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    renderPage()

    expect(await screen.findByText('Produto A')).toBeInTheDocument()
    expect(screen.getByText('Saída')).toBeInTheDocument()
    expect(screen.getByText('#5')).toBeInTheDocument()
  })

  it('should fall back to "#idProduto" and a dash when produto/venda are missing', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([{ ...movimento, produto: undefined, idVenda: undefined }])
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    renderPage()

    expect(await screen.findByText('#1')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('should refetch when the date filter changes', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([])
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    renderPage()

    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({}))

    fireEvent.change(screen.getByLabelText('Data Início'), { target: { value: '2026-01-01' } })

    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({ dataInicio: '2026-01-01' }))
  })

  it('should refetch when the "Data Fim" filter changes', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([])
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    renderPage()

    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({}))

    fireEvent.change(screen.getByLabelText('Data Fim'), { target: { value: '2026-01-31' } })

    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({ dataFim: '2026-01-31' }))
  })

  it('should refetch when the "Produto" filter changes and is cleared', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([])
    vi.mocked(produtoApi.getAll).mockResolvedValue([
      {
        id: 1,
        descricao: 'Produto A',
        valorCusto: '10.00',
        valorVenda: '15.00',
        estoque: 8,
        categoria: { id: 1, descricao: 'Categoria A' },
        regraFiscal: {
          id: 1,
          descricao: 'Regra A',
          ncm: '1234.56.78',
          icms: 0,
          pis: 0,
          cofins: 0,
          ipi: 0,
        },
      },
    ])
    renderPage()

    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({}))

    fireEvent.change(await screen.findByLabelText('Produto'), { target: { value: '1' } })
    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({ idProduto: 1 }))

    fireEvent.change(screen.getByLabelText('Produto'), { target: { value: '' } })
    await waitFor(() => expect(estoqueApi.getAll).toHaveBeenCalledWith({ idProduto: undefined }))
  })

  it('should show a loading spinner while fetching', async () => {
    vi.mocked(estoqueApi.getAll).mockReturnValue(new Promise(() => {}))
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    const { container } = renderPage()

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
