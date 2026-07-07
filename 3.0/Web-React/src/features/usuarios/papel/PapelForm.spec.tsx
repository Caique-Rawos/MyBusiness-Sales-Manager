import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { PapelForm } from './PapelForm'
import type { Papel, PermissaoResumo } from './types'

const permissoes: PermissaoResumo[] = [
  { id: 1, chave: 'venda:criar', descricao: 'Criar - Venda' },
  { id: 2, chave: 'venda:listar', descricao: 'Listar/visualizar - Venda' },
  { id: 3, chave: 'venda:editar', descricao: 'Editar - Venda' },
  { id: 4, chave: 'venda:deletar', descricao: 'Excluir - Venda' },
  { id: 5, chave: 'cliente:criar', descricao: 'Criar - Cliente' },
  { id: 6, chave: 'cliente:listar', descricao: 'Listar/visualizar - Cliente' },
]

function vendaRow() {
  return screen.getByText('Venda').closest('tr')!
}

function clienteRow() {
  return screen.getByText('Cliente').closest('tr')!
}

describe('PapelForm', () => {
  it('should group permissoes by module into matrix rows', () => {
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    expect(screen.getByText('Venda')).toBeInTheDocument()
    expect(screen.getByText('Cliente')).toBeInTheDocument()
    // Cliente so tem criar/listar -- as celulas de editar/deletar ficam vazias (sem checkbox),
    // +1 checkbox de "selecionar linha inteira" em cada linha
    expect(within(clienteRow()).getAllByRole('checkbox')).toHaveLength(3)
    expect(within(vendaRow()).getAllByRole('checkbox')).toHaveLength(5)
  })

  it('should require at least one permissao selected', async () => {
    const onSubmit = vi.fn()
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome do papel'), { target: { value: 'Vendedor' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar papel' }))

    expect(await screen.findByText('Selecione ao menos uma permissão')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should toggle individual permissoes and submit the selected ids', async () => {
    const onSubmit = vi.fn()
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome do papel'), { target: { value: 'Vendedor' } })
    const [criarVenda] = within(vendaRow()).getAllByRole('checkbox')
    fireEvent.click(criarVenda)
    fireEvent.click(screen.getByRole('button', { name: 'Criar papel' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ nome: 'Vendedor', permissaoIds: [1] }))
  })

  it('should toggle every cell in a row via the row-level checkbox, without touching other rows', async () => {
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    const vendaCheckboxes = within(vendaRow()).getAllByRole('checkbox')
    const vendaRowToggle = vendaCheckboxes[vendaCheckboxes.length - 1]
    fireEvent.click(vendaRowToggle)

    await waitFor(() => {
      within(vendaRow())
        .getAllByRole('checkbox')
        .forEach((checkbox) => expect(checkbox).toBeChecked())
    })
    within(clienteRow())
      .getAllByRole('checkbox')
      .forEach((checkbox) => expect(checkbox).not.toBeChecked())

    fireEvent.click(vendaRowToggle)
    await waitFor(() => {
      within(vendaRow())
        .getAllByRole('checkbox')
        .forEach((checkbox) => expect(checkbox).not.toBeChecked())
    })
  })

  it('should uncheck an individual permissao', async () => {
    const onSubmit = vi.fn()
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={onSubmit} onNew={vi.fn()} isPending={false} />)

    fireEvent.change(screen.getByLabelText('Nome do papel'), { target: { value: 'Vendedor' } })
    const [criarVenda, listarVenda] = within(vendaRow()).getAllByRole('checkbox')
    fireEvent.click(criarVenda)
    fireEvent.click(listarVenda)
    fireEvent.click(criarVenda)
    fireEvent.click(screen.getByRole('button', { name: 'Criar papel' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ nome: 'Vendedor', permissaoIds: [2] }))
  })

  it('should select and clear every permissao via "Marcar tudo"/"Limpar tudo"', async () => {
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    fireEvent.click(screen.getByText('Marcar tudo'))
    await waitFor(() => {
      screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeChecked())
    })

    fireEvent.click(screen.getByText('Limpar tudo'))
    await waitFor(() => {
      screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked())
    })
  })

  it('should populate nome and check the assigned permissoes when editing', async () => {
    const editing: Papel = {
      id: 1,
      nome: 'Admin',
      tenantId: 1,
      permissoes: [permissoes[0], permissoes[4]],
    }

    render(<PapelForm editing={editing} permissoes={permissoes} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)

    await waitFor(() => expect(screen.getByLabelText('Nome do papel')).toHaveValue('Admin'))
    const [criarVenda] = within(vendaRow()).getAllByRole('checkbox')
    const [criarCliente] = within(clienteRow()).getAllByRole('checkbox')
    expect(criarVenda).toBeChecked()
    expect(criarCliente).toBeChecked()
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
  })

  it('should show "Salvando..." when pending', () => {
    render(<PapelForm editing={null} permissoes={permissoes} onSubmit={vi.fn()} onNew={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })

  it('should fall back to the modulo name when a descricao has no " - " separator', () => {
    const semSeparador: PermissaoResumo[] = [{ id: 10, chave: 'estoque:listar', descricao: 'EstoqueSemSeparador' }]
    render(<PapelForm editing={null} permissoes={semSeparador} onSubmit={vi.fn()} onNew={vi.fn()} isPending={false} />)
    expect(screen.getByText('estoque')).toBeInTheDocument()
  })
})
