import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VendaForm } from './VendaForm'
import type { Cliente } from '../../clientes/types'

const clientes: Cliente[] = [{ id: 1, nome: 'Fulano', cpfCnpj: '123' }]

describe('VendaForm', () => {
  it('should require cliente and data', async () => {
    render(<VendaForm clientes={clientes} onSubmit={vi.fn()} isPending={false} onRelatorio={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Selecione um cliente')).toBeInTheDocument()
    expect(await screen.findByText('Data é obrigatória')).toBeInTheDocument()
  })

  it('should submit and reset the form', async () => {
    const onSubmit = vi.fn()
    render(<VendaForm clientes={clientes} onSubmit={onSubmit} isPending={false} onRelatorio={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Data da Venda'), { target: { value: '2026-01-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ selecionarCliente: '1', dataVenda: '2026-01-01' }))
    await waitFor(() => expect(screen.getByLabelText('Cliente')).toHaveValue(''))
  })

  it('should call onRelatorio when the report button is clicked', () => {
    const onRelatorio = vi.fn()
    render(<VendaForm clientes={clientes} onSubmit={vi.fn()} isPending={false} onRelatorio={onRelatorio} />)

    fireEvent.click(screen.getByRole('button', { name: /relatório/i }))

    expect(onRelatorio).toHaveBeenCalledTimes(1)
  })

  it('should show "Cadastrando..." when pending', () => {
    render(<VendaForm clientes={clientes} onSubmit={vi.fn()} isPending={true} onRelatorio={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeInTheDocument()
  })
})
