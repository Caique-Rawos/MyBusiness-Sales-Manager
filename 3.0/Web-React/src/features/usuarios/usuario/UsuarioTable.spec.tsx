import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UsuarioTable } from './UsuarioTable'
import type { Usuario } from './types'
import type { PapelResumo } from '../papel/types'

const papeis: PapelResumo[] = [
  { id: 1, nome: 'Vendedor' },
  { id: 2, nome: 'Financeiro' },
]

const dono: Usuario = {
  id: 1,
  nome: 'Dono',
  email: 'dono@teste.com',
  tenantId: 1,
  ativo: true,
  isOwner: true,
  criadoEm: '2026-01-01',
  papeis: [],
}

const comum: Usuario = {
  id: 2,
  nome: 'Fulano',
  email: 'fulano@teste.com',
  tenantId: 1,
  ativo: true,
  isOwner: false,
  criadoEm: '2026-01-01',
  papeis: [{ id: 1, nome: 'Vendedor' }],
}

describe('UsuarioTable', () => {
  it('should show the empty state when there are no usuarios', () => {
    render(<UsuarioTable usuarios={[]} papeis={papeis} isLoading={false} isSaving={false} onUpdatePapeis={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument()
  })

  it('should show "Acesso total" and hide actions for the owner', () => {
    render(<UsuarioTable usuarios={[dono]} papeis={papeis} isLoading={false} isSaving={false} onUpdatePapeis={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Acesso total')).toBeInTheDocument()
    expect(screen.getByTitle('Dono da loja')).toBeInTheDocument()
    expect(screen.queryByTitle('Editar papéis')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument()
  })

  it('should show "Sem papel" for a common user without papeis', () => {
    render(
      <UsuarioTable
        usuarios={[{ ...comum, papeis: [] }]}
        papeis={papeis}
        isLoading={false}
        isSaving={false}
        onUpdatePapeis={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Sem papel')).toBeInTheDocument()
  })

  it('should list the papeis badges for a common user', () => {
    render(<UsuarioTable usuarios={[comum]} papeis={papeis} isLoading={false} isSaving={false} onUpdatePapeis={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Vendedor')).toBeInTheDocument()
  })

  it('should call onDelete for a common user', () => {
    const onDelete = vi.fn()
    render(<UsuarioTable usuarios={[comum]} papeis={papeis} isLoading={false} isSaving={false} onUpdatePapeis={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByTitle('Excluir'))
    expect(onDelete).toHaveBeenCalledWith(comum)
  })

  it('should open the papeis modal prefilled and save the updated selection', async () => {
    const onUpdatePapeis = vi.fn()
    render(
      <UsuarioTable
        usuarios={[comum]}
        papeis={papeis}
        isLoading={false}
        isSaving={false}
        onUpdatePapeis={onUpdatePapeis}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTitle('Editar papéis'))

    expect(screen.getByText('Papéis de Fulano')).toBeInTheDocument()
    expect(screen.getByLabelText('Vendedor')).toBeChecked()
    expect(screen.getByLabelText('Financeiro')).not.toBeChecked()

    fireEvent.click(screen.getByLabelText('Financeiro'))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onUpdatePapeis).toHaveBeenCalledWith(2, [1, 2])
    await waitFor(() => expect(screen.queryByText('Papéis de Fulano')).not.toBeInTheDocument())
  })

  it('should uncheck an already-assigned papel before saving', () => {
    const onUpdatePapeis = vi.fn()
    render(
      <UsuarioTable
        usuarios={[comum]}
        papeis={papeis}
        isLoading={false}
        isSaving={false}
        onUpdatePapeis={onUpdatePapeis}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTitle('Editar papéis'))
    fireEvent.click(screen.getByLabelText('Vendedor'))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onUpdatePapeis).toHaveBeenCalledWith(2, [])
  })

  it('should close the modal without saving on cancel', () => {
    const onUpdatePapeis = vi.fn()
    render(
      <UsuarioTable
        usuarios={[comum]}
        papeis={papeis}
        isLoading={false}
        isSaving={false}
        onUpdatePapeis={onUpdatePapeis}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTitle('Editar papéis'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByText('Papéis de Fulano')).not.toBeInTheDocument()
    expect(onUpdatePapeis).not.toHaveBeenCalled()
  })

  it('should close the modal when clicking the backdrop', () => {
    const { container } = render(
      <UsuarioTable
        usuarios={[comum]}
        papeis={papeis}
        isLoading={false}
        isSaving={false}
        onUpdatePapeis={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTitle('Editar papéis'))
    fireEvent.click(container.querySelector('.backdrop-blur-sm')!)

    expect(screen.queryByText('Papéis de Fulano')).not.toBeInTheDocument()
  })

  it('should show "Salvando..." on the save button while isSaving', () => {
    render(
      <UsuarioTable
        usuarios={[comum]}
        papeis={papeis}
        isLoading={false}
        isSaving={true}
        onUpdatePapeis={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByTitle('Editar papéis'))
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument()
  })
})
