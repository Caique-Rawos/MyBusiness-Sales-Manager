import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { ClientesPage } from './index'
import { clienteApi } from './api'
import type { Cliente } from './types'

vi.mock('./api', () => ({
  clienteApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const cliente: Cliente = { id: 1, nome: 'Fulano', cpfCnpj: '12345678900' }

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <ClientesPage />
    </QueryClientProvider>,
  )
}

describe('ClientesPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should list clientes and create a new one', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    vi.mocked(clienteApi.create).mockResolvedValue({ id: 2, nome: 'Ciclano', cpfCnpj: '98765432100' })
    renderPage()

    expect(await screen.findByText('Fulano')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ciclano' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '98765432100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(clienteApi.create).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Cliente cadastrado!')
  })

  it('should edit a cliente and exit editing mode on success', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    vi.mocked(clienteApi.update).mockResolvedValue({ ...cliente, nome: 'Novo nome' })
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue('Fulano'))

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Novo nome' } })
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Atualizado com sucesso!'))
    expect(clienteApi.update).toHaveBeenCalledWith(1, expect.objectContaining({ nome: 'Novo nome' }))
  })

  it('should confirm and delete a cliente', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    vi.mocked(clienteApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    expect(screen.getByText('Excluir "Fulano"?')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(clienteApi.delete).toHaveBeenCalledWith(1, expect.anything()))
    expect(toast.success).toHaveBeenCalledWith('Cliente excluído!')
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([])
    vi.mocked(clienteApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Nome'), { target: { value: 'Fulano' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar cliente.'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    vi.mocked(clienteApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue('Fulano'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar cliente.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    vi.mocked(clienteApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir cliente.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue('Fulano'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/não pode ser desfeita/)).not.toBeInTheDocument())
  })
})
