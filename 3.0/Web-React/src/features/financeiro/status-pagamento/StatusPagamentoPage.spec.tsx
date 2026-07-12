import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { StatusPagamentoPage } from './StatusPagamentoPage'
import { statusPagamentoApi } from './api'
import type { StatusPagamento } from './types'

vi.mock('./api', () => ({
  statusPagamentoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const status: StatusPagamento = { id: 1, descricao: 'Pago', cor: '#22c55e' }

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <StatusPagamentoPage />
    </QueryClientProvider>,
  )
}

describe('StatusPagamentoPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create a status de pagamento', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([])
    vi.mocked(statusPagamentoApi.create).mockResolvedValue(status)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Pago' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Status cadastrado!'))
  })

  it('should edit and delete a status de pagamento', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    vi.mocked(statusPagamentoApi.update).mockResolvedValue(status)
    vi.mocked(statusPagamentoApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Pago'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Status atualizado!'))

    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Status excluído!'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    vi.mocked(statusPagamentoApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Pago'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    vi.mocked(statusPagamentoApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Pago'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText('Esta ação não pode ser desfeita.')).not.toBeInTheDocument())
  })
})
