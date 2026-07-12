import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StatusPagamentoForm } from './StatusPagamentoForm'
import type { StatusPagamento } from './types'

describe('StatusPagamentoForm', () => {
  it('should default the color picker to blue', () => {
    const { container } = render(<StatusPagamentoForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    expect(container.querySelector('input[type="color"]')).toHaveValue('#3b82f6')
  })

  it('should require descricao', async () => {
    render(<StatusPagamentoForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Descrição é obrigatória')).toBeInTheDocument()
  })

  it('should submit the filled data', async () => {
    const onSubmit = vi.fn()
    render(<StatusPagamentoForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Pago' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ descricao: 'Pago', cor: '#3b82f6' }))
  })

  it('should populate the form when editing', async () => {
    const editing: StatusPagamento = { id: 1, descricao: 'Pago', cor: '#22c55e' }
    const { container } = render(<StatusPagamentoForm editing={editing} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    expect(screen.getByText('Editando: Pago')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Pago'))
    expect(container.querySelector('input[type="color"]')).toHaveValue('#22c55e')
  })

  it('should show "Salvando..." when pending', () => {
    render(<StatusPagamentoForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })
})
