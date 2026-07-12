import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import toast from 'react-hot-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryWrapper } from '../../test/query-wrapper'
import { SignupPage } from './SignupPage'
import { useAuth } from '../../shared/context/AuthContext'

vi.mock('../../shared/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

function renderPage(signup: (data: unknown) => Promise<void>) {
  vi.mocked(useAuth).mockReturnValue({ signup } as unknown as ReturnType<typeof useAuth>)
  const { queryClient } = createQueryWrapper()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <SignupPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

function fillForm() {
  fireEvent.change(screen.getByLabelText('Nome da loja'), { target: { value: 'Minha Loja' } })
  fireEvent.change(screen.getByLabelText('CPF/CNPJ'), { target: { value: '12345678900' } })
  fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Fulano' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'a@a.com' } })
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } })
}

describe('SignupPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should signup and navigate to / on success', async () => {
    const signup = vi.fn().mockResolvedValue(undefined)
    renderPage(signup)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /criar minha loja/i }))

    await waitFor(() => expect(signup).toHaveBeenCalled())
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true })
  })

  it('should show an error toast on failure', async () => {
    const signup = vi.fn().mockRejectedValue(new Error('409'))
    renderPage(signup)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /criar minha loja/i }))

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Não foi possível criar sua loja. Verifique os dados e tente novamente.'),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should link to the login page', () => {
    renderPage(vi.fn())
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
  })
})
