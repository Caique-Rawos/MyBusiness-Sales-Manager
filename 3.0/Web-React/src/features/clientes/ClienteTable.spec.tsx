import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ClienteTable } from './ClienteTable'
import type { Cliente } from './types'

const cliente: Cliente = { id: 1, nome: 'Fulano', cpfCnpj: '12345678900' }

describe('ClienteTable', () => {
  it('should show a spinner while loading', () => {
    const { container } = render(<ClienteTable clientes={[]} isLoading onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should show the empty state when there are no clientes', () => {
    render(<ClienteTable clientes={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should render clientes with the formatted cpfCnpj', () => {
    render(<ClienteTable clientes={[cliente]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Fulano')).toBeInTheDocument()
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<ClienteTable clientes={[cliente]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))

    expect(onEdit).toHaveBeenCalledWith(cliente)
    expect(onDelete).toHaveBeenCalledWith(cliente)
  })
})
