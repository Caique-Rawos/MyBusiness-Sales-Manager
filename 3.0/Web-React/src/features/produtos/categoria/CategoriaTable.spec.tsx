import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoriaTable } from './CategoriaTable'
import type { Categoria } from './types'

const categoria: Categoria = { id: 1, descricao: 'Bebidas' }

describe('CategoriaTable', () => {
  it('should show a spinner while loading', () => {
    const { container } = render(<CategoriaTable categorias={[]} isLoading onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show the empty state when there are no categorias', () => {
    render(<CategoriaTable categorias={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should render categorias and call onEdit/onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<CategoriaTable categorias={[categoria]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    expect(screen.getByText('Bebidas')).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(categoria)
    expect(onDelete).toHaveBeenCalledWith(categoria)
  })
})
