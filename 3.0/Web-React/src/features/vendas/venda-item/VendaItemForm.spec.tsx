import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VendaItemForm } from './VendaItemForm'
import type { Produto } from '../../produtos/types'

const produtos = [
  { id: 1, descricao: 'Produto A', valorVenda: '25.00' },
] as Produto[]

describe('VendaItemForm', () => {
  it('should show the read-only venda code', () => {
    render(<VendaItemForm idVenda={7} produtos={produtos} onSubmit={vi.fn()} isPending={false} />)
    expect(screen.getByLabelText('Código da Venda')).toHaveValue('7')
  })

  it('should auto-fill valor venda when a produto is selected and compute the subtotal', async () => {
    render(<VendaItemForm idVenda={1} produtos={produtos} onSubmit={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Produto'), { target: { value: '1' } })

    await waitFor(() => expect(screen.getByLabelText('Valor Venda')).toHaveValue(25))

    fireEvent.change(screen.getByLabelText('Desconto Unit.'), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '2' } })

    await waitFor(() => expect(screen.getByLabelText('Sub Total')).toHaveValue('40.00'))
  })

  it('should require quantidade and produto', async () => {
    render(<VendaItemForm idVenda={1} produtos={produtos} onSubmit={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Item' }))

    expect(await screen.findByText('Selecione um produto')).toBeInTheDocument()
    expect(await screen.findByText('Quantidade é obrigatória')).toBeInTheDocument()
  })

  it('should submit and reset the form', async () => {
    const onSubmit = vi.fn()
    render(<VendaItemForm idVenda={1} produtos={produtos} onSubmit={onSubmit} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Produto'), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Quantidade'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Item' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByLabelText('Produto')).toHaveValue(''))
  })

  it('should show "Adicionando..." when pending', () => {
    render(<VendaItemForm idVenda={1} produtos={produtos} onSubmit={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Adicionando...' })).toBeInTheDocument()
  })
})
