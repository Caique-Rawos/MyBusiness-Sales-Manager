import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PagamentoForm } from './PagamentoForm'
import type { Pagamento } from './types'

describe('PagamentoForm', () => {
  it('should require descricao', async () => {
    render(<PagamentoForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Descrição é obrigatória')).toBeInTheDocument()
  })

  it('should submit and reset when creating', async () => {
    const onSubmit = vi.fn()
    render(<PagamentoForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Dinheiro' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ descricao: 'Dinheiro' }))
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue(''))
  })

  it('should populate the form when editing', async () => {
    const editing: Pagamento = { id: 1, descricao: 'Dinheiro' }
    render(<PagamentoForm editing={editing} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    expect(screen.getByText('Editando: Dinheiro')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Dinheiro'))
  })

  it('should show "Salvando..." when pending', () => {
    render(<PagamentoForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })
})
