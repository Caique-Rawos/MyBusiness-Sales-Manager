import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('should render children and respond to clicks', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Salvar</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should default to the primary variant and md size classes', () => {
    render(<Button>Ok</Button>)
    const button = screen.getByRole('button', { name: 'Ok' })
    expect(button).toHaveClass('bg-blue-600', 'px-4', 'py-2')
  })

  it('should apply variant and size classes', () => {
    render(<Button variant="danger" size="lg">Excluir</Button>)
    const button = screen.getByRole('button', { name: 'Excluir' })
    expect(button).toHaveClass('bg-red-600', 'px-6', 'py-3')
  })
})
