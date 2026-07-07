import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusPagamentoTable } from './StatusPagamentoTable'
import type { StatusPagamento } from './types'

const status: StatusPagamento = { id: 1, descricao: 'Pago', cor: '#22c55e' }

describe('StatusPagamentoTable', () => {
  it('should show the empty state when there are no status', () => {
    render(<StatusPagamentoTable statusList={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should render the descricao badge and the hex code', () => {
    render(<StatusPagamentoTable statusList={[status]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Pago')).toBeInTheDocument()
    expect(screen.getByText('#22c55e')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<StatusPagamentoTable statusList={[status]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(status)
    expect(onDelete).toHaveBeenCalledWith(status)
  })
})
