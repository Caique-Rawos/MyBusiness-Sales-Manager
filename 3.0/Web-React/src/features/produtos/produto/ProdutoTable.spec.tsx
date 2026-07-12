import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProdutoTable } from './ProdutoTable'
import type { Produto } from './types'

const produto = {
  id: 1,
  descricao: 'Produto Teste',
  valorCusto: '10.00',
  valorVenda: '20.00',
  estoque: 5,
  categoria: { id: 1, descricao: 'Bebidas' },
} as Produto

describe('ProdutoTable', () => {
  it('should show the empty state when there are no produtos', () => {
    render(<ProdutoTable produtos={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should format currency values and show the categoria descricao', () => {
    render(<ProdutoTable produtos={[produto]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 20,00')).toBeInTheDocument()
    expect(screen.getByText('Bebidas')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<ProdutoTable produtos={[produto]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(produto)
    expect(onDelete).toHaveBeenCalledWith(produto)
  })
})
