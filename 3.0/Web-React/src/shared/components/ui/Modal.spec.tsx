import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('should render nothing when closed', () => {
    render(<Modal open={false} onClose={vi.fn()}>Conteúdo</Modal>)
    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('should render content and title when open', () => {
    render(<Modal open onClose={vi.fn()} title="Nova Categoria">Conteúdo</Modal>)
    expect(screen.getByText('Nova Categoria')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('should lock body scroll while open and release it on close', () => {
    const { rerender } = render(<Modal open onClose={vi.fn()}>Conteúdo</Modal>)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Modal open={false} onClose={vi.fn()}>Conteúdo</Modal>)
    expect(document.body.style.overflow).toBe('')
  })

  it('should call onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal open onClose={onClose}>Conteúdo</Modal>)

    fireEvent.click(container.querySelector('.bg-black\\/50')!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} title="Título">Conteúdo</Modal>)

    fireEvent.click(screen.getByRole('button'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
