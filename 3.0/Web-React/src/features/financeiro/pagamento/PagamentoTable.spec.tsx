import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PagamentoTable } from './PagamentoTable'
import type { Pagamento } from './types'

const pagamento: Pagamento = { id: 1, descricao: 'Dinheiro' }

describe('PagamentoTable', () => {
  it('should show a loading row', () => {
    render(<PagamentoTable pagamentos={[]} isLoading onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should show the empty state when there are no pagamentos', () => {
    render(<PagamentoTable pagamentos={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<PagamentoTable pagamentos={[pagamento]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    expect(screen.getByText('Dinheiro')).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(pagamento)
    expect(onDelete).toHaveBeenCalledWith(pagamento)
  })
})
