import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './AuthContext'
import http from '../api/http'
import { refreshSession } from '../lib/refresh-session'
import { clearSession } from '../lib/auth-session'

vi.mock('../api/http', () => ({ default: { post: vi.fn() } }))
vi.mock('../lib/refresh-session', () => ({ refreshSession: vi.fn() }))

const session = {
  accessToken: 'access-token',
  usuario: { id: 1, nome: 'Fulano', email: 'fulano@teste.com', permissions: ['venda:listar'], isOwner: false },
  tenant: { id: 1, schema: 'tenant_1' },
}

function TestConsumer() {
  const auth = useAuth()
  return (
    <div>
      <span>isAuthenticated:{String(auth.isAuthenticated)}</span>
      <span>isLoading:{String(auth.isLoading)}</span>
      <span>user:{auth.user?.nome ?? '-'}</span>
      <span>hasVendaListar:{String(auth.hasPermission('venda:listar'))}</span>
      <span>hasVendaDeletar:{String(auth.hasPermission('venda:deletar'))}</span>
      <button onClick={() => auth.login('fulano@teste.com', 'senha123')}>login</button>
      <button
        onClick={() =>
          auth.signup({
            nome: 'Fulano',
            email: 'fulano@teste.com',
            senha: 'senha123',
            nomeFantasia: 'Loja',
            cpfCnpj: '123',
            endereco: 'Rua A',
          })
        }
      >
        signup
      </button>
      <button onClick={() => auth.logout()}>logout</button>
    </div>
  )
}

function renderWithProvider() {
  const queryClient = new QueryClient()
  const clearSpy = vi.spyOn(queryClient, 'clear')
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>,
  )
  return { ...utils, clearSpy }
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearSession()
  })

  it('should throw when useAuth is used outside of AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<TestConsumer />)).toThrow('useAuth deve ser usado dentro de AuthProvider')
    consoleError.mockRestore()
  })

  it('should become authenticated when refreshSession resolves with a session on mount', async () => {
    vi.mocked(refreshSession).mockResolvedValue(session)

    renderWithProvider()

    await waitFor(() => expect(screen.getByText('isLoading:false')).toBeInTheDocument())
    expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument()
    expect(screen.getByText('user:Fulano')).toBeInTheDocument()
  })

  it('should stay unauthenticated when refreshSession resolves with null', async () => {
    vi.mocked(refreshSession).mockResolvedValue(null)

    renderWithProvider()

    await waitFor(() => expect(screen.getByText('isLoading:false')).toBeInTheDocument())
    expect(screen.getByText('isAuthenticated:false')).toBeInTheDocument()
  })

  it('should login, store the session and clear the query cache', async () => {
    vi.mocked(refreshSession).mockResolvedValue(null)
    vi.mocked(http.post).mockResolvedValue({ data: session })

    const { clearSpy } = renderWithProvider()
    await waitFor(() => expect(screen.getByText('isLoading:false')).toBeInTheDocument())

    fireEvent.click(screen.getByText('login'))

    await waitFor(() => expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument())
    expect(http.post).toHaveBeenCalledWith('/auth/login', { email: 'fulano@teste.com', senha: 'senha123' })
    expect(clearSpy).toHaveBeenCalled()
  })

  it('should signup, store the session and clear the query cache', async () => {
    vi.mocked(refreshSession).mockResolvedValue(null)
    vi.mocked(http.post).mockResolvedValue({ data: session })

    const { clearSpy } = renderWithProvider()
    await waitFor(() => expect(screen.getByText('isLoading:false')).toBeInTheDocument())

    fireEvent.click(screen.getByText('signup'))

    await waitFor(() => expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument())
    expect(http.post).toHaveBeenCalledWith('/tenants/signup', expect.objectContaining({ email: 'fulano@teste.com' }))
    expect(clearSpy).toHaveBeenCalled()
  })

  it('should logout, clear the session and the query cache even if the API call fails', async () => {
    vi.mocked(refreshSession).mockResolvedValue(session)
    vi.mocked(http.post).mockRejectedValue(new Error('network error'))

    const { clearSpy } = renderWithProvider()
    await waitFor(() => expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument())

    fireEvent.click(screen.getByText('logout'))

    await waitFor(() => expect(screen.getByText('isAuthenticated:false')).toBeInTheDocument())
    expect(clearSpy).toHaveBeenCalled()
  })

  it('should compute hasPermission from the permissions list, false without a session', async () => {
    vi.mocked(refreshSession).mockResolvedValue(session)

    renderWithProvider()

    await waitFor(() => expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument())
    expect(screen.getByText('hasVendaListar:true')).toBeInTheDocument()
    expect(screen.getByText('hasVendaDeletar:false')).toBeInTheDocument()
  })

  it('should grant every permission when the user isOwner', async () => {
    vi.mocked(refreshSession).mockResolvedValue({
      ...session,
      usuario: { ...session.usuario, isOwner: true, permissions: [] },
    })

    renderWithProvider()

    await waitFor(() => expect(screen.getByText('isAuthenticated:true')).toBeInTheDocument())
    expect(screen.getByText('hasVendaListar:true')).toBeInTheDocument()
    expect(screen.getByText('hasVendaDeletar:true')).toBeInTheDocument()
  })
})
