import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'

const tabs = [
  { value: 'dados', label: 'Dados' },
  { value: 'permissoes', label: 'Permissões' },
]

describe('Tabs', () => {
  it('should highlight the active tab', () => {
    render(<Tabs tabs={tabs} value="dados" onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Dados' })).toHaveClass('border-blue-600', 'text-blue-600')
    expect(screen.getByRole('button', { name: 'Permissões' })).toHaveClass('border-transparent')
  })

  it('should call onChange with the clicked tab value', () => {
    const onChange = vi.fn()
    render(<Tabs tabs={tabs} value="dados" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Permissões' }))

    expect(onChange).toHaveBeenCalledWith('permissoes')
  })
})
