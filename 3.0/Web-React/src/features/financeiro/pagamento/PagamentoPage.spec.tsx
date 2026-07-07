import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { PagamentoPage } from './PagamentoPage'
import { pagamentoApi } from './api'
import type { Pagamento } from './types'

vi.mock('./api', () => ({
  pagamentoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const pagamento: Pagamento = { id: 1, descricao: 'Dinheiro' }

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <PagamentoPage />
    </QueryClientProvider>,
  )
}

describe('PagamentoPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create a forma de pagamento', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([])
    vi.mocked(pagamentoApi.create).mockResolvedValue(pagamento)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Dinheiro' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Forma de pagamento cadastrada!'))
  })

  it('should edit and delete a forma de pagamento', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    vi.mocked(pagamentoApi.update).mockResolvedValue(pagamento)
    vi.mocked(pagamentoApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Dinheiro'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Forma de pagamento atualizada!'))

    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Forma de pagamento excluída!'))
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([])
    vi.mocked(pagamentoApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Dinheiro' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar.'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    vi.mocked(pagamentoApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Dinheiro'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    vi.mocked(pagamentoApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Dinheiro'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText('Esta ação não pode ser desfeita.')).not.toBeInTheDocument())
  })
})
