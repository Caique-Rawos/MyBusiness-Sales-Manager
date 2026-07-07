import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PapelTable } from './PapelTable'
import type { Papel } from './types'

const papel: Papel = {
  id: 1,
  nome: 'Admin',
  tenantId: 1,
  permissoes: [{ id: 1, chave: 'venda:listar', descricao: 'x' }, { id: 2, chave: 'venda:criar', descricao: 'y' }],
}

describe('PapelTable', () => {
  it('should show a loading spinner while isLoading', () => {
    const { container } = render(<PapelTable papeis={[]} isLoading={true} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show the empty state when there are no papeis', () => {
    render(<PapelTable papeis={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should render the papel nome and permission count badge', () => {
    render(<PapelTable papeis={[papel]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('2 permissões')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<PapelTable papeis={[papel]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(papel)
    expect(onDelete).toHaveBeenCalledWith(papel)
  })
})
