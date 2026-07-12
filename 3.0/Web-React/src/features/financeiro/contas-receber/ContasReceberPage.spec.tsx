import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { ContasReceberPage } from './ContasReceberPage'
import { contasReceberApi } from './api'
import { pagamentoApi } from '../pagamento/api'
import { statusPagamentoApi } from '../status-pagamento/api'
import type { ContasReceber } from './types'

vi.mock('./api', () => ({
  contasReceberApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../pagamento/api', () => ({ pagamentoApi: { getAll: vi.fn() } }))
vi.mock('../status-pagamento/api', () => ({ statusPagamentoApi: { getAll: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const contaManual: ContasReceber = {
  id: 1,
  descricao: 'Conta manual',
  valorTotal: '100.00',
  valorPago: '0.00',
  dataVencimento: '2026-07-01T00:00:00.000Z',
  pagamento: { id: 1, descricao: 'Dinheiro' },
  statusPagamento: { id: 1, descricao: 'Pendente', cor: '#f59e0b' },
}

const contaDeVenda: ContasReceber = {
  id: 2,
  descricao: 'Lançamento de Venda',
  valorTotal: '0.00',
  valorPago: '0.00',
  dataVencimento: '2026-07-07T00:00:00.000Z',
  idVenda: 5,
  pagamento: null,
  statusPagamento: null,
}

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <ContasReceberPage />
    </QueryClientProvider>,
  )
}

describe('ContasReceberPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([{ id: 1, descricao: 'Dinheiro' }])
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([{ id: 1, descricao: 'Pendente', cor: '#f59e0b' }])
  })

  it('should show "Venda #N" in the lancamento column and create a manual conta', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaDeVenda])
    vi.mocked(contasReceberApi.create).mockResolvedValue(contaManual)
    renderPage()

    expect(await screen.findByText('Venda #5')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Conta manual' } })
    fireEvent.change(screen.getByLabelText('Data de Vencimento'), { target: { value: '2026-08-01' } })
    fireEvent.change(screen.getByLabelText('Valor Total'), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText('Forma de Pagamento'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Status de Pagamento'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(contasReceberApi.create).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Conta cadastrada!')
  })

  it('should omit valorTotal from the payload when editing a conta linked to a venda', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaDeVenda])
    vi.mocked(contasReceberApi.update).mockResolvedValue(contaDeVenda)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Lançamento de Venda'))

    fireEvent.change(screen.getByLabelText('Forma de Pagamento'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Status de Pagamento'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Conta atualizada!'))
    const [, payload] = vi.mocked(contasReceberApi.update).mock.calls[0]
    expect(payload).not.toHaveProperty('valorTotal')
  })

  it('should delete a conta', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaManual])
    vi.mocked(contasReceberApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Conta excluída!'))
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([])
    vi.mocked(contasReceberApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Conta manual' } })
    fireEvent.change(screen.getByLabelText('Data de Vencimento'), { target: { value: '2026-08-01' } })
    fireEvent.change(screen.getByLabelText('Valor Total'), { target: { value: '100' } })
    await screen.findByRole('option', { name: 'Dinheiro' })
    fireEvent.change(screen.getByLabelText('Forma de Pagamento'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Status de Pagamento'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar.'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaManual])
    vi.mocked(contasReceberApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Conta manual'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaManual])
    vi.mocked(contasReceberApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaManual])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Conta manual'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([contaManual])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/não pode ser desfeita/)).not.toBeInTheDocument())
  })
})
