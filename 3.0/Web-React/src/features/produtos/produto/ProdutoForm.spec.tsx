import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProdutoForm } from './ProdutoForm'
import type { Categoria } from '../categoria/types'
import type { RegraFiscal } from '../regra-fiscal/types'
import type { Produto } from './types'

const categorias: Categoria[] = [{ id: 1, descricao: 'Bebidas' }]
const regrasFiscais: RegraFiscal[] = [{ id: 1, descricao: 'Tributado', ncm: '1234', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }]

describe('ProdutoForm', () => {
  it('should show validation errors for categoria and regra fiscal when submitting empty', async () => {
    render(
      <ProdutoForm
        editing={null}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={vi.fn()}
        isPending={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Categoria é obrigatória')).toBeInTheDocument()
    expect(await screen.findByText('Regra fiscal é obrigatória')).toBeInTheDocument()
  })

  it('should open the "Nova categoria" modal and forward the typed description', () => {
    const onCreateCategoria = vi.fn()
    render(
      <ProdutoForm
        editing={null}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={onCreateCategoria}
        isPending={false}
      />,
    )

    fireEvent.click(screen.getByTitle('Nova categoria'))
    expect(screen.getByText('Nova Categoria')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Nome da categoria'), { target: { value: 'Limpeza' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Cadastrar' }).at(-1)!)

    expect(onCreateCategoria).toHaveBeenCalledWith('Limpeza', expect.any(Function))
  })

  it('should auto-select the newly created categoria once it appears in the list and close the modal', async () => {
    const onCreateCategoria = vi.fn((_descricao: string, onSuccess: (id: number) => void) => onSuccess(2))
    const { rerender } = render(
      <ProdutoForm
        editing={null}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={onCreateCategoria}
        isPending={false}
      />,
    )

    fireEvent.click(screen.getByTitle('Nova categoria'))
    fireEvent.change(screen.getByPlaceholderText('Nome da categoria'), { target: { value: 'Limpeza' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Cadastrar' }).at(-1)!)

    await waitFor(() => expect(screen.queryByText('Nova Categoria')).not.toBeInTheDocument())

    rerender(
      <ProdutoForm
        editing={null}
        categorias={[...categorias, { id: 2, descricao: 'Limpeza' }]}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={onCreateCategoria}
        isPending={false}
      />,
    )

    await waitFor(() => expect(screen.getByLabelText('Categoria')).toHaveValue('2'))
  })

  it('should populate the form when editing and lock the estoque field', async () => {
    const editing: Produto = {
      id: 1,
      descricao: 'Produto Teste',
      valorCusto: '10.00',
      valorVenda: '20.00',
      estoque: 5,
      categoria: { id: 1, descricao: 'Bebidas' },
      regraFiscal: regrasFiscais[0],
    }

    render(
      <ProdutoForm
        editing={editing}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={vi.fn()}
        isPending={false}
      />,
    )

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Produto Teste'))
    expect(screen.getByLabelText('Estoque')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Categoria')).toHaveValue('1')
    expect(screen.getByLabelText('Regra Fiscal')).toHaveValue('1')
  })

  it('should close the "Nova categoria" modal without creating when clicking "Fechar"', () => {
    const onCreateCategoria = vi.fn()
    render(
      <ProdutoForm
        editing={null}
        categorias={categorias}
        regrasFiscais={regrasFiscais}
        onSubmit={vi.fn()}
        onNew={vi.fn()}
        onCreateCategoria={onCreateCategoria}
        isPending={false}
      />,
    )

    fireEvent.click(screen.getByTitle('Nova categoria'))
    expect(screen.getByText('Nova Categoria')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByText('Nova Categoria')).not.toBeInTheDocument()
    expect(onCreateCategoria).not.toHaveBeenCalled()
  })
})
