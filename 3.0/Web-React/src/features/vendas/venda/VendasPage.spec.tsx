import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { VendasPage } from './VendasPage'
import { vendaApi } from './api'
import { clienteApi } from '../../clientes/api'
import type { Venda } from './types'

vi.mock('./api', () => ({
  vendaApi: { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() },
  relatorioApi: { getByRange: vi.fn(), getByCliente: vi.fn(), getByData: vi.fn() },
}))
vi.mock('../../clientes/api', () => ({ clienteApi: { getAll: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const venda = { id: 1, totalVenda: '100.00', dataVenda: '2026-01-01T00:00:00.000Z', cliente: { id: 1, nome: 'Fulano' } } as Venda

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <VendasPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('VendasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(clienteApi.getAll).mockResolvedValue([{ id: 1, nome: 'Fulano', cpfCnpj: '123' }])
  })

  it('should create a venda', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([])
    vi.mocked(vendaApi.create).mockResolvedValue(venda)
    renderPage()

    await screen.findByRole('option', { name: 'Fulano' })
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Data da Venda'), { target: { value: '2026-01-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() =>
      expect(vendaApi.create).toHaveBeenCalledWith({ idCliente: 1, dataVenda: '2026-01-01' }, expect.anything()),
    )
    expect(toast.success).toHaveBeenCalledWith('Venda cadastrada!')
  })

  it('should navigate to the itens and cupom routes', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([venda])
    renderPage()

    fireEvent.click(await screen.findByTitle('Gerenciar itens'))
    expect(navigateMock).toHaveBeenCalledWith('/vendas/1/itens')

    fireEvent.click(screen.getByTitle('Ver cupom fiscal'))
    expect(navigateMock).toHaveBeenCalledWith('/vendas/1/cupom')
  })

  it('should delete a venda', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([venda])
    vi.mocked(vendaApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir venda'))
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Venda excluída!'))
  })

  it('should navigate to the relatorio route with the chosen dates and tipo', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([])
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /relatório/i }))
    fireEvent.change(screen.getByLabelText('Data Início'), { target: { value: '2026-01-01' } })
    fireEvent.change(screen.getByLabelText('Data Final'), { target: { value: '2026-01-31' } })
    fireEvent.change(screen.getByLabelText('Tipo de Relatório'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gerar' }))

    expect(navigateMock).toHaveBeenCalledWith('/relatorio/cliente?dataInicio=2026-01-01&dataFinal=2026-01-31')
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([])
    vi.mocked(vendaApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    await screen.findByRole('option', { name: 'Fulano' })
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Data da Venda'), { target: { value: '2026-01-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar venda.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([venda])
    vi.mocked(vendaApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir venda'))
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir venda.'))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([venda])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir venda'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/removidos automaticamente/)).not.toBeInTheDocument())
  })
})
