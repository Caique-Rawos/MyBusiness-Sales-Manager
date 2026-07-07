import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/login" element={<div>Página de login</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Conteúdo protegido</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('should show a loading state while auth is resolving', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: true } as unknown as ReturnType<typeof useAuth>)
    renderProtected()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should redirect to /login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: false } as unknown as ReturnType<typeof useAuth>)
    renderProtected()
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })

  it('should render the nested route when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, isLoading: false } as unknown as ReturnType<typeof useAuth>)
    renderProtected()
    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
  })
})
