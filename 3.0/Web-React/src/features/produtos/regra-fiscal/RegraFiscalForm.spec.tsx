import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegraFiscalForm } from './RegraFiscalForm'
import type { RegraFiscal } from './types'

describe('RegraFiscalForm', () => {
  it('should mask the NCM field while typing', () => {
    render(<RegraFiscalForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    const input = screen.getByLabelText('NCM')
    fireEvent.change(input, { target: { value: '12345678' } })
    expect(input).toHaveValue('1234.56.78')
  })

  it('should require descricao', async () => {
    render(<RegraFiscalForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Descrição é obrigatória')).toBeInTheDocument()
  })

  it('should populate the form when editing', async () => {
    const editing: RegraFiscal = { id: 1, descricao: 'Tributado', ncm: '1234.56.78', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }
    render(<RegraFiscalForm editing={editing} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Tributado'))
    expect(screen.getByLabelText('NCM')).toHaveValue('1234.56.78')
    expect(screen.getByLabelText('ICMS (%)')).toHaveValue(18)
  })

  it('should show "Salvando..." when pending and a "Novo" button when editing', () => {
    const editing: RegraFiscal = { id: 1, descricao: 'Tributado', ncm: '1234.56.78', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }
    const onNew = vi.fn()
    render(<RegraFiscalForm editing={editing} onSubmit={vi.fn()} onNew={onNew} isPending={true} />)

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))
    expect(onNew).toHaveBeenCalled()
  })
})
