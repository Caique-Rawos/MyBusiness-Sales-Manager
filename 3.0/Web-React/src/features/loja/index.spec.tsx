import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { LojaPage } from './index'
import { lojaApi } from './api'
import type { Loja } from './types'

vi.mock('./api', () => ({ lojaApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <LojaPage />
    </QueryClientProvider>,
  )
}

describe('LojaPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create the loja when none exists yet', async () => {
    vi.mocked(lojaApi.getAll).mockResolvedValue([])
    vi.mocked(lojaApi.create).mockResolvedValue({ id: 1 } as Loja)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Nome Fantasia'), { target: { value: 'Minha Loja' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(lojaApi.create).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Dados da loja salvos!')
  })

  it('should update the existing loja and show an error toast on failure', async () => {
    const loja: Loja = { id: 1, nomeFantasia: 'Minha Loja', cpfCnpj: '12345678900', endereco: 'Rua A, 1' }
    vi.mocked(lojaApi.getAll).mockResolvedValue([loja])
    vi.mocked(lojaApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    await waitFor(() => expect(screen.getByLabelText('Nome Fantasia')).toHaveValue('Minha Loja'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao salvar.'))
    expect(lojaApi.update).toHaveBeenCalledWith(1, expect.objectContaining({ nomeFantasia: 'Minha Loja' }))
  })
})
