import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ClienteForm } from './ClienteForm'
import type { Cliente } from './types'

describe('ClienteForm', () => {
  it('should show the "Novo Cliente" title when not editing', () => {
    render(<ClienteForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
  })

  it('should mask the cpfCnpj field while typing', () => {
    render(<ClienteForm editing={null} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    const input = screen.getByLabelText('CPF/CNPJ')
    fireEvent.change(input, { target: { value: '12345678900' } })
    expect(input).toHaveValue('123.456.789-00')
  })

  it('should show validation errors and not submit when required fields are empty', async () => {
    const onSubmit = vi.fn()
    render(<ClienteForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit the filled data and reset the form when creating', async () => {
    const onSubmit = vi.fn()
    render(<ClienteForm editing={null} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Fulano' } })
    fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ nome: 'Fulano', cpfCnpj: '123.456.789-00', observacao: '' }),
    )
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''))
  })

  it('should populate the form when editing and offer a "Novo" button', async () => {
    const editing: Cliente = { id: 1, nome: 'Fulano', cpfCnpj: '12345678900', observacao: 'VIP' }
    render(<ClienteForm editing={editing} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    expect(screen.getByText('Editando cliente #1')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue('Fulano'))
    expect(screen.getByLabelText('CPF/CNPJ')).toHaveValue('12345678900')
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
  })
})
