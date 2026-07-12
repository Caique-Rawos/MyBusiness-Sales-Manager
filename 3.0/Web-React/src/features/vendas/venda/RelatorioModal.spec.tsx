import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RelatorioModal } from './RelatorioModal'

describe('RelatorioModal', () => {
  it('should disable "Gerar" until both dates are filled', () => {
    render(<RelatorioModal open onClose={vi.fn()} onGerar={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Data Início'), { target: { value: '2026-01-01' } })
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Data Final'), { target: { value: '2026-01-31' } })
    expect(screen.getByRole('button', { name: 'Gerar' })).not.toBeDisabled()
  })

  it('should call onGerar with the dates and selected tipo, then close', () => {
    const onGerar = vi.fn()
    const onClose = vi.fn()
    render(<RelatorioModal open onClose={onClose} onGerar={onGerar} />)

    fireEvent.change(screen.getByLabelText('Data Início'), { target: { value: '2026-01-01' } })
    fireEvent.change(screen.getByLabelText('Data Final'), { target: { value: '2026-01-31' } })
    fireEvent.change(screen.getByLabelText('Tipo de Relatório'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gerar' }))

    expect(onGerar).toHaveBeenCalledWith('2026-01-01', '2026-01-31', '2')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when cancelling', () => {
    const onClose = vi.fn()
    render(<RelatorioModal open onClose={onClose} onGerar={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
