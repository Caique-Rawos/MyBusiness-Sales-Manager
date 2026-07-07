import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { ProdutosPage } from './ProdutosPage'
import { produtoApi } from './api'
import { categoriaApi } from '../categoria/api'
import { regraFiscalApi } from '../regra-fiscal/api'
import type { Produto } from './types'

vi.mock('./api', () => ({
  produtoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../categoria/api', () => ({
  categoriaApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../regra-fiscal/api', () => ({ regraFiscalApi: { getAll: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const produto = {
  id: 1,
  descricao: 'Produto Teste',
  valorCusto: '10.00',
  valorVenda: '20.00',
  estoque: 5,
  categoria: { id: 1, descricao: 'Bebidas' },
  regraFiscal: { id: 1, descricao: 'Tributado' },
} as Produto

function renderPage() {
  const { queryClient } = createQueryWrapper()
  return render(
    <QueryClientProvider client={queryClient}>
      <ProdutosPage />
    </QueryClientProvider>,
  )
}

describe('ProdutosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(categoriaApi.getAll).mockResolvedValue([{ id: 1, descricao: 'Bebidas' }])
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([
      { id: 1, descricao: 'Tributado', ncm: '1234', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 },
    ])
  })

  it('should list produtos and create a new one', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    vi.mocked(produtoApi.create).mockResolvedValue(produto)
    renderPage()

    expect(await screen.findByText('Produto Teste')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Novo Produto' } })
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Regra Fiscal'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(produtoApi.create).toHaveBeenCalled())
    expect(toast.success).toHaveBeenCalledWith('Produto cadastrado!')
  })

  it('should strip estoque from the payload when editing', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    vi.mocked(produtoApi.update).mockResolvedValue(produto)
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Produto Teste'))

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Produto atualizado!'))
    const [, payload] = vi.mocked(produtoApi.update).mock.calls[0]
    expect(payload).not.toHaveProperty('estoque')
  })

  it('should delete a produto', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    vi.mocked(produtoApi.delete).mockResolvedValue(undefined)
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Produto excluído!'))
  })

  it('should create a categoria inline from the modal and select it', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    vi.mocked(categoriaApi.create).mockResolvedValue({ id: 2, descricao: 'Limpeza' })
    // apos criar, o hook invalida a query de categorias e refaz o getAll -- simula o backend
    // ja devolvendo a nova categoria na lista refeita
    vi.mocked(categoriaApi.getAll)
      .mockResolvedValueOnce([{ id: 1, descricao: 'Bebidas' }])
      .mockResolvedValue([{ id: 1, descricao: 'Bebidas' }, { id: 2, descricao: 'Limpeza' }])
    renderPage()

    fireEvent.click(await screen.findByTitle('Nova categoria'))
    fireEvent.change(screen.getByPlaceholderText('Nome da categoria'), { target: { value: 'Limpeza' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Cadastrar' }).at(-1)!)

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Categoria criada!'))
    await waitFor(() => expect(screen.getByLabelText('Categoria')).toHaveValue('2'))
  })

  it('should show an error toast when create fails', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    vi.mocked(produtoApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.change(await screen.findByLabelText('Descrição'), { target: { value: 'Novo Produto' } })
    await screen.findByRole('option', { name: 'Bebidas' })
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: '1' } })
    await screen.findByRole('option', { name: 'Tributado' })
    fireEvent.change(screen.getByLabelText('Regra Fiscal'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao cadastrar produto.'))
  })

  it('should show an error toast when update fails', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    vi.mocked(produtoApi.update).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Produto Teste'))
    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar produto.'))
  })

  it('should show an error toast when delete fails', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    vi.mocked(produtoApi.delete).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getAllByRole('button', { name: 'Excluir' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao excluir produto.'))
  })

  it('should show an error toast when inline categoria creation fails', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([])
    vi.mocked(categoriaApi.create).mockRejectedValue(new Error('falhou'))
    renderPage()

    fireEvent.click(await screen.findByTitle('Nova categoria'))
    fireEvent.change(screen.getByPlaceholderText('Nome da categoria'), { target: { value: 'Limpeza' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Cadastrar' }).at(-1)!)

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Erro ao criar categoria.'))
  })

  it('should reset editing when clicking "Novo"', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    renderPage()

    fireEvent.click(await screen.findByTitle('Editar'))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Produto Teste'))
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should close the confirm modal when cancelling delete', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    renderPage()

    fireEvent.click(await screen.findByTitle('Excluir'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByText(/não pode ser desfeita/)).not.toBeInTheDocument())
  })
})
