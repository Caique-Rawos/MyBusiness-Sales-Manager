import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { LoginPage } from './LoginPage'
import { useAuth } from '../../shared/context/AuthContext'

vi.mock('../../shared/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function renderPage(login: (email: string, senha: string) => Promise<void>) {
  vi.mocked(useAuth).mockReturnValue({ login } as unknown as ReturnType<typeof useAuth>)
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should login and navigate to / on success', async () => {
    const login = vi.fn().mockResolvedValue(undefined)
    renderPage(login)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(login).toHaveBeenCalledWith('a@a.com', '123456'))
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true })
  })

  it('should show an error toast on invalid credentials', async () => {
    const login = vi.fn().mockRejectedValue(new Error('401'))
    renderPage(login)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('E-mail ou senha inválidos.'))
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should link to the signup page', () => {
    renderPage(vi.fn())
    expect(screen.getByRole('link', { name: 'Criar minha loja' })).toHaveAttribute('href', '/signup')
  })
})
