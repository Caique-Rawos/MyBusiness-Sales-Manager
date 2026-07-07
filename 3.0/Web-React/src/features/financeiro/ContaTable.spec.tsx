import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContaTable } from './ContaTable'
import type { ContasReceber } from './contas-receber/types'
import type { ContasPagar } from './contas-pagar/types'

const contaSemPagamento: ContasReceber = {
  id: 1,
  descricao: 'Lançamento de Venda',
  valorTotal: '0.00',
  valorPago: '0.00',
  dataVencimento: '2026-07-07T00:00:00.000Z',
  idVenda: 5,
  pagamento: null,
  statusPagamento: null,
}

const contaPaga: ContasPagar = {
  id: 2,
  descricao: 'Aluguel',
  valorTotal: '100.00',
  valorPago: '100.00',
  dataVencimento: '2026-07-01T00:00:00.000Z',
  pagamento: { id: 1, descricao: 'Dinheiro' },
  statusPagamento: { id: 1, descricao: 'Pago', cor: '#22c55e' },
}

describe('ContaTable', () => {
  it('should show a loading row', () => {
    render(<ContaTable title="Contas" contas={[]} isLoading />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should show the empty state when there are no contas', () => {
    render(<ContaTable title="Contas" contas={[]} isLoading={false} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should show a dash badge when the conta has no status de pagamento', () => {
    render(<ContaTable title="Contas" contas={[contaSemPagamento]} isLoading={false} />)
    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('should show the status badge when present', () => {
    render(<ContaTable title="Contas" contas={[contaPaga]} isLoading={false} />)
    expect(screen.getByText('Pago')).toBeInTheDocument()
  })

  it('should show "Venda #N" or "Manual" in the lancamento column when showLancamento is set', () => {
    render(<ContaTable title="Contas" contas={[contaSemPagamento, contaPaga]} isLoading={false} showLancamento />)
    expect(screen.getByText('Venda #5')).toBeInTheDocument()
    expect(screen.getByText('Manual')).toBeInTheDocument()
  })

  it('should not render the acoes column when neither onEdit nor onDelete is provided', () => {
    render(<ContaTable title="Contas" contas={[contaPaga]} isLoading={false} />)
    expect(screen.queryByText('Ações')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument()
  })

  it('should call onEdit and onDelete when provided', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<ContaTable title="Contas" contas={[contaPaga]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))

    expect(onEdit).toHaveBeenCalledWith(contaPaga)
    expect(onDelete).toHaveBeenCalledWith(contaPaga)
  })
})
