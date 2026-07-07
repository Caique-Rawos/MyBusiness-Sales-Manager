import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('should render nothing when closed', () => {
    render(<ConfirmModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.queryByText('Confirmar exclusão')).not.toBeInTheDocument()
  })

  it('should render default copy and call the callbacks', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<ConfirmModal open onConfirm={onConfirm} onCancel={onCancel} />)

    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should accept custom copy', () => {
    render(
      <ConfirmModal
        open
        title="Remover papel?"
        description="Usuários com esse papel perderão as permissões."
        confirmLabel="Remover"
        cancelLabel="Voltar"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByText('Remover papel?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
  })

  it('should disable both buttons and show a pending label while isPending', () => {
    render(<ConfirmModal open isPending onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Excluindo...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
