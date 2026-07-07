import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VendaItemTable } from './VendaItemTable'
import type { VendaItem } from './types'

const item = {
  id: 1,
  precoUnitario: '10.00',
  desconto: '0.00',
  quantidade: '2',
  subTotal: '20.00',
  produto: { id: 1, descricao: 'Produto A' },
} as VendaItem

describe('VendaItemTable', () => {
  it('should show a loading row', () => {
    render(<VendaItemTable itens={[]} isLoading onDelete={vi.fn()} />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should show the empty state when there are no itens', () => {
    render(<VendaItemTable itens={[]} isLoading={false} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should format currency values and show produto descricao', () => {
    render(<VendaItemTable itens={[item]} isLoading={false} onDelete={vi.fn()} />)
    expect(screen.getByText('Produto A')).toBeInTheDocument()
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 20,00')).toBeInTheDocument()
  })

  it('should show a dash when produto is missing', () => {
    render(<VendaItemTable itens={[{ ...item, produto: undefined as never }]} isLoading={false} onDelete={vi.fn()} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('should call onDelete', () => {
    const onDelete = vi.fn()
    render(<VendaItemTable itens={[item]} isLoading={false} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onDelete).toHaveBeenCalledWith(item)
  })
})
