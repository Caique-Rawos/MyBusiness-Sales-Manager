import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegraFiscalTable } from './RegraFiscalTable'
import type { RegraFiscal } from './types'

const regra: RegraFiscal = { id: 1, descricao: 'Tributado', ncm: '1234.56.78', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }

describe('RegraFiscalTable', () => {
  it('should show the empty state when there are no regras', () => {
    render(<RegraFiscalTable regras={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should format the tax percentages with two decimal places', () => {
    render(<RegraFiscalTable regras={[regra]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('18.00%')).toBeInTheDocument()
    expect(screen.getByText('1.65%')).toBeInTheDocument()
    expect(screen.getByText('7.60%')).toBeInTheDocument()
    expect(screen.getByText('0.00%')).toBeInTheDocument()
  })

  it('should call onEdit and onDelete', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<RegraFiscalTable regras={[regra]} isLoading={false} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(screen.getByTitle('Editar'))
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onEdit).toHaveBeenCalledWith(regra)
    expect(onDelete).toHaveBeenCalledWith(regra)
  })
})
