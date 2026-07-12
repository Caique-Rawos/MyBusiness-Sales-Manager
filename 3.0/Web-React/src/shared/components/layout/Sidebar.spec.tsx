import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import type { AuthUser } from '../../lib/auth-session'

const fulano: AuthUser = { id: 1, nome: 'Fulano', email: 'fulano@teste.com', permissions: [], isOwner: false }

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function mockAuth(overrides: Partial<ReturnType<typeof useAuth>>) {
  vi.mocked(useAuth).mockReturnValue(overrides as unknown as ReturnType<typeof useAuth>)
}

function renderSidebar(open: boolean, onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <Sidebar open={open} onClose={onClose} />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  const logout = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
    logout.mockResolvedValue(undefined)
    mockAuth({ user: fulano, hasPermission: () => true, logout })
  })

  it('should only render nav items the user has permission for', () => {
    mockAuth({
      user: fulano,
      hasPermission: (permission: string) => permission === 'cliente:listar',
      logout,
    })

    renderSidebar(true)

    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.queryByText('Vendas')).not.toBeInTheDocument()
  })

  it('should not render the backdrop when closed', () => {
    const { container } = renderSidebar(false)
    expect(container.querySelector('.bg-black\\/50')).not.toBeInTheDocument()
  })

  it('should render the backdrop and call onClose when clicked, when open', () => {
    const onClose = vi.fn()
    const { container } = renderSidebar(true, onClose)

    const backdrop = container.querySelector('.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should close when a nav link is clicked', () => {
    const onClose = vi.fn()
    renderSidebar(true, onClose)

    fireEvent.click(screen.getByText('Dashboard'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should always keep the desktop visibility class regardless of open state', () => {
    const { container: closedContainer } = renderSidebar(false)
    const { container: openContainer } = renderSidebar(true)

    expect(closedContainer.querySelector('aside')).toHaveClass('lg:translate-x-0', '-translate-x-full')
    expect(openContainer.querySelector('aside')).toHaveClass('lg:translate-x-0', 'translate-x-0')
  })

  it('should expand a nav group to reveal its items when clicked', () => {
    renderSidebar(true)

    expect(screen.queryByText('Regras Fiscais')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Produtos'))
    expect(screen.getByText('Regras Fiscais')).toBeInTheDocument()
  })

  it('should logout and redirect to /login', async () => {
    renderSidebar(true)

    fireEvent.click(screen.getByText('Sair'))

    expect(logout).toHaveBeenCalled()
    await vi.waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true }))
  })
})
