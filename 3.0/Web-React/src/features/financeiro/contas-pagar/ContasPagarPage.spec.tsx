import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { ContasPagarPage } from './ContasPagarPage'
import { contasPagarApi } from './api'
import { pagamentoApi } from '../pagamento/api'
import { statusPagamentoApi } from '../status-pagamento/api'
import type { ContasPagar } from './types'

vi.mock('./api', () => ({
  contasPagarApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../pagamento/api', () => ({ pagamentoApi: { getAll: vi.fn() } }))
vi.mock('../status-pagamento/api', () => ({ statusPagamentoApi: { getAll: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const conta: ContasPagar = {
  id: 1,
  descricao: 'Aluguel',
  valorTotal: '100.00',
  valorPago: '0.00',
  dataVencimento: '2026-07-01T00:00:00.000Z',
  pagamento: { id: 1, descricao: 'Dinheiro' },
  statusPagamento: { id: 1, descricao: 'Pendente', cor: '#f59e0b' },
}

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <ContasPagarPage />
    </QueryClientProvider>,
  )
}

describe('ContasPagarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([{ id: 1, descricao: 'Dinheiro' }])
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([{ id: 1, descricao: 'Pendente', cor: '#f59e0b' }])
  })

  it('should list contas a pagar and create a new one', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    vi.mocked(contasPagarApi.create).mockResolvedValue(conta)
    renderPage()

    expect(await screen.findByText('Aluguel')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Água' } })
    fireEvent.change(screen.getByLabelText('Data de Vencimento'), { target: { value: '2026-08-01' } })
    fireEvent.change(screen.getByLabelText('Valor Total'), { target: { value: '80' } })
    fireEvent.change(screen.getByLabelText('Forma de Pagamento'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Status de Pagamento'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(contasPagarApi.create).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Conta cadastrada!')
  })

  it('should edit an existing conta', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    vi.mocked(contasPagarApi.update).mockResolvedValue(conta)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Aluguel'))

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Conta atualizada!'))
    expect(contasPagarApi.update).toHaveBeenCalledWith(1, expect.objectContaining({ descricao: 'Aluguel' }))
  })

  it('should delete a conta', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    vi.mocked(contasPagarApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Conta excluída!'))
    expect(contasPagarApi.delete).toHaveBeenCalledWith(1, expect.anything())
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([])
    vi.mocked(contasPagarApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Água' } })
    fireEvent.change(screen.getByLabelText('Data de Vencimento'), { target: { value: '2026-08-01' } })
    fireEvent.change(screen.getByLabelText('Valor Total'), { target: { value: '80' } })
    await screen.findByRole('option', { name: 'Dinheiro' })
    fireEvent.change(screen.getByLabelText('Forma de Pagamento'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Status de Pagamento'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar.'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    vi.mocked(contasPagarApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Aluguel'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    vi.mocked(contasPagarApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Aluguel'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/não pode ser desfeita/)).not.toBeInTheDocument())
  })
})
