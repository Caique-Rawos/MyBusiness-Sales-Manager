import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { useAuth } from '../../context/AuthContext'
import type { AuthUser } from '../../lib/auth-session'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

const fulano: AuthUser = { id: 1, nome: 'Fulano', email: 'fulano@teste.com', permissions: [], isOwner: false }

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Conteudo da pagina</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: fulano,
      hasPermission: () => true,
      logout: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useAuth>)
  })

  it('should render the routed page content', () => {
    renderLayout()
    expect(screen.getByText('Conteudo da pagina')).toBeInTheDocument()
  })

  it('should open the drawer via the mobile hamburger button and close it via the backdrop', () => {
    const { container } = renderLayout()

    expect(container.querySelector('.bg-black\\/50')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Abrir menu'))
    const backdrop = container.querySelector('.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()

    fireEvent.click(backdrop!)
    expect(container.querySelector('.bg-black\\/50')).not.toBeInTheDocument()
  })

  it('should close the drawer after navigating to another page', () => {
    const { container } = renderLayout()

    fireEvent.click(screen.getByLabelText('Abrir menu'))
    expect(container.querySelector('.bg-black\\/50')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Dashboard'))
    expect(container.querySelector('.bg-black\\/50')).not.toBeInTheDocument()
  })
})
