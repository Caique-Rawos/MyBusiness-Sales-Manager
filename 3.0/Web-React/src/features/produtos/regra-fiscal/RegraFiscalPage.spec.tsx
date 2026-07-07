import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { RegraFiscalPage } from './RegraFiscalPage'
import { regraFiscalApi } from './api'
import type { RegraFiscal } from './types'

vi.mock('./api', () => ({
  regraFiscalApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const regra: RegraFiscal = { id: 1, descricao: 'Tributado', ncm: '1234.56.78', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <RegraFiscalPage />
    </QueryClientProvider>,
  )
}

describe('RegraFiscalPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create a regra fiscal', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([])
    vi.mocked(regraFiscalApi.create).mockResolvedValue(regra)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Tributado' } })
    fireEvent.change(screen.getByLabelText('NCM'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Regra fiscal cadastrada!'))
  })

  it('should edit and delete a regra fiscal', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regra])
    vi.mocked(regraFiscalApi.update).mockResolvedValue(regra)
    vi.mocked(regraFiscalApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Tributado'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Regra fiscal atualizada!'))

    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Regra fiscal excluída!'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regra])
    vi.mocked(regraFiscalApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Tributado'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regra])
    vi.mocked(regraFiscalApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir regra fiscal.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regra])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Tributado'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regra])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/não pode ser desfeita/)).not.toBeInTheDocument())
  })
})
