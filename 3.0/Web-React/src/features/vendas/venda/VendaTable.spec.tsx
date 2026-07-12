import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VendaTable } from './VendaTable'
import type { Venda } from './types'

const venda = {
  id: 1,
  totalVenda: '150.00',
  dataVenda: '2026-01-01T00:00:00.000Z',
  cliente: { id: 1, nome: 'Fulano' },
} as Venda

describe('VendaTable', () => {
  it('should show a loading row', () => {
    render(<VendaTable vendas={[]} isLoading onAddItens={vi.fn()} onCupom={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should show the empty state when there are no vendas', () => {
    render(<VendaTable vendas={[]} isLoading={false} onAddItens={vi.fn()} onCupom={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should render formatted currency, date and cliente nome', () => {
    render(<VendaTable vendas={[venda]} isLoading={false} onAddItens={vi.fn()} onCupom={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Fulano')).toBeInTheDocument()
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    expect(screen.getByText('01/01/2026')).toBeInTheDocument()
  })

  it('should show a dash when cliente is missing', () => {
    render(
      <VendaTable
        vendas={[{ ...venda, cliente: undefined as never }]}
        isLoading={false}
        onAddItens={vi.fn()}
        onCupom={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('should call onAddItens, onCupom and onDelete', () => {
    const onAddItens = vi.fn()
    const onCupom = vi.fn()
    const onDelete = vi.fn()
    render(<VendaTable vendas={[venda]} isLoading={false} onAddItens={onAddItens} onCupom={onCupom} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Gerenciar itens'))
    fireEvent.click(screen.getByTitle('Ver cupom fiscal'))
    fireEvent.click(screen.getByTitle('Excluir venda'))

    expect(onAddItens).toHaveBeenCalledWith(1)
    expect(onCupom).toHaveBeenCalledWith(1)
    expect(onDelete).toHaveBeenCalledWith(venda)
  })
})
