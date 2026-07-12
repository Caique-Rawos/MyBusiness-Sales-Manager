import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { CategoriaPage } from './CategoriaPage'
import { categoriaApi } from './api'
import type { Categoria } from './types'

vi.mock('./api', () => ({
  categoriaApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const categoria: Categoria = { id: 1, descricao: 'Bebidas' }

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <CategoriaPage />
    </QueryClientProvider>,
  )
}

describe('CategoriaPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should create a categoria', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([])
    vi.mocked(categoriaApi.create).mockResolvedValue(categoria)
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Bebidas' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Categoria cadastrada!'))
  })

  it('should edit and delete a categoria', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    vi.mocked(categoriaApi.update).mockResolvedValue(categoria)
    vi.mocked(categoriaApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Bebidas'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Categoria atualizada!'))

    fireEvent.click(screen.getByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Categoria excluída!'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    vi.mocked(categoriaApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Bebidas'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar categoria.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    vi.mocked(categoriaApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir categoria.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Bebidas'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText('Esta ação não pode ser desfeita.')).not.toBeInTheDocument())
  })
})
