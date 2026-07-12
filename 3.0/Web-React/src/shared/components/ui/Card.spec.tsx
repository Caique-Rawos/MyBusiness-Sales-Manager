import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('should render children without a title header', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('should render the title header when provided', () => {
    render(<Card title="Meus dados">Conteúdo</Card>)
    expect(screen.getByRole('heading', { name: 'Meus dados' })).toBeInTheDocument()
  })
})
