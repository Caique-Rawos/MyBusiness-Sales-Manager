import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContaForm } from './ContaForm'
import type { Pagamento } from './pagamento/types'
import type { StatusPagamento } from './status-pagamento/types'
import type { ContasReceber } from './contas-receber/types'

const formasPagamento: Pagamento[] = [{ id: 1, descricao: 'Dinheiro' }]
const statusList: StatusPagamento[] = [{ id: 1, descricao: 'Pago', cor: 'green' }]

describe('ContaForm', () => {
  it('should show friendly validation messages instead of the default zod message when submitting without payment fields', async () => {
    const onSubmit = vi.fn()
    render(
      <ContaForm
        title="Nova Conta"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={onSubmit}
        isPending={false}
      />,
    )

    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Conta teste' } })
    fireEvent.change(screen.getByLabelText('Data de Vencimento'), { target: { value: '2026-12-31' } })
    fireEvent.change(screen.getByLabelText('Valor Total'), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByText('Selecione a forma de pagamento')).toBeInTheDocument()
    expect(await screen.findByText('Selecione o status de pagamento')).toBeInTheDocument()
    expect(screen.queryByText(/too small/i)).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should populate the form when editing a conta that has no pagamento/status linked and the catalogs are empty', async () => {
    const editing: ContasReceber = {
      id: 1,
      descricao: 'Lançamento de Venda',
      valorTotal: '0.00',
      valorPago: '0.00',
      dataVencimento: '2026-07-07T00:00:00.000Z',
      idVenda: 1,
      pagamento: null,
      statusPagamento: null,
    }

    render(
      <ContaForm
        title="Nova Conta"
        formasPagamento={[]}
        statusList={[]}
        onSubmit={vi.fn()}
        isPending={false}
        editing={editing}
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Descrição')).toHaveValue('Lançamento de Venda')
    })
    expect(screen.getByLabelText('Valor Total')).toHaveValue(0)
    expect(screen.getByLabelText('Data de Vencimento')).toHaveValue('2026-07-07')
    expect(screen.getByLabelText('Forma de Pagamento')).toHaveValue('')
    expect(screen.getByLabelText('Status de Pagamento')).toHaveValue('')
  })

  it('should lock valorTotal and show the linked-to-venda hint when editing a conta tied to a venda', async () => {
    const editing: ContasReceber = {
      id: 1,
      descricao: 'Lançamento de Venda',
      valorTotal: '150.00',
      valorPago: '0.00',
      dataVencimento: '2026-07-07T00:00:00.000Z',
      idVenda: 1,
      pagamento: { id: 1, descricao: 'Dinheiro' },
      statusPagamento: { id: 1, descricao: 'Pago', cor: 'green' },
    }

    render(
      <ContaForm
        title="Nova Conta"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={vi.fn()}
        isPending={false}
        editing={editing}
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Valor Total')).toHaveAttribute('readonly')
    })
    expect(screen.getByText('Gerenciado automaticamente pela venda vinculada.')).toBeInTheDocument()
  })

  it('should show "Salvando..." when pending', () => {
    render(
      <ContaForm
        title="Nova Conta"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={vi.fn()}
        isPending={true}
      />,
    )
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })

  it('should wait for the pagamento/status catalogs to load before populating the form', async () => {
    const editing: ContasReceber = {
      id: 1,
      descricao: 'Lançamento de Venda',
      valorTotal: '150.00',
      valorPago: '0.00',
      dataVencimento: '2026-07-07T00:00:00.000Z',
      idVenda: 1,
      pagamento: { id: 1, descricao: 'Dinheiro' },
      statusPagamento: { id: 1, descricao: 'Pago', cor: 'green' },
    }

    const { rerender } = render(
      <ContaForm
        title="Nova Conta"
        formasPagamento={[]}
        statusList={[]}
        onSubmit={vi.fn()}
        isPending={false}
        editing={editing}
      />,
    )

    expect(screen.getByLabelText('Descrição')).toHaveValue('')

    rerender(
      <ContaForm
        title="Nova Conta"
        formasPagamento={formasPagamento}
        statusList={statusList}
        onSubmit={vi.fn()}
        isPending={false}
        editing={editing}
      />,
    )

    await waitFor(() => expect(screen.getByLabelText('Descrição')).toHaveValue('Lançamento de Venda'))
    expect(screen.getByLabelText('Forma de Pagamento')).toHaveValue('1')
    expect(screen.getByLabelText('Status de Pagamento')).toHaveValue('1')
  })
})
