import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { VendaItemPage } from './VendaItemPage'
import { vendaItemApi } from './api'
import { produtoApi } from '../../produtos/produto/api'
import type { VendaItem } from './types'

vi.mock('./api', () => ({ vendaItemApi: { getByVenda: vi.fn(), create: vi.fn(), delete: vi.fn() } }))
vi.mock('../../produtos/produto/api', () => ({ produtoApi: { getAll: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const item = {
  id: 1,
  precoUnitario: '10.00',
  desconto: '0',
  quantidade: '2',
  subTotal: '20.00',
  produto: { id: 1, descricao: 'Produto A' },
} as VendaItem

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter initialEntries={['/vendas/1/itens']}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/vendas/:id/itens" element={<VendaItemPage />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('VendaItemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(produtoApi.getAll).mockResolvedValue([
      { id: 1, descricao: 'Produto A', valorVenda: '10.00' } as never,
    ])
  })

  it('should navigate back to /vendas', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([])
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /voltar/i }))
    expect(navigateMock).toHaveBeenCalledWith('/vendas')
  })

  it('should add an item computing the subtotal payload', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([])
    vi.mocked(vendaItemApi.create).mockResolvedValue(item)
    renderPage()

    await screen.findByRole('option', { name: 'Produto A' })
    fireEvent.change(screen.getByLabelText('Produto'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Item' }))

    await waitFor(() =>
      expect(vendaItemApi.create).toHaveBeenCalledWith(
        {
          idVenda: 1,
          idProduto: 1,
          precoUnitario: 10,
          desconto: 0,
          quantidade: 2,
          subTotal: 20,
        },
        expect.anything(),
      ),
    )
    expect(toast.success).toHaveBeenCalledWith('Item adicionado!')
  })

  it('should remove an item', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([item])
    vi.mocked(vendaItemApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Remover' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Item removido!'))
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([])
    vi.mocked(vendaItemApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    await screen.findByRole('option', { name: 'Produto A' })
    fireEvent.change(screen.getByLabelText('Produto'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Item' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao adicionar item.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([item])
    vi.mocked(vendaItemApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Remover' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao remover item.'))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([item])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText('Remover item da venda?')).not.toBeInTheDocument())
  })
})
