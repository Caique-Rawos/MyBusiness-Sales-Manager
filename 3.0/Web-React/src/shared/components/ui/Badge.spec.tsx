import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should use the neutral gray style when no color is given', () => {
    render(<Badge>Pendente</Badge>)
    const badge = screen.getByText('Pendente')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-700')
    expect(badge).not.toHaveAttribute('style')
  })

  it('should apply a custom color via inline style when provided', () => {
    render(<Badge color="#22c55e">Pago</Badge>)
    const badge = screen.getByText('Pago')
    expect(badge).not.toHaveClass('bg-gray-100')
    expect(badge.style.color).toBe('rgb(34, 197, 94)')
    expect(badge.style.backgroundColor).toBe('rgba(34, 197, 94, 0.133)')
  })
})
