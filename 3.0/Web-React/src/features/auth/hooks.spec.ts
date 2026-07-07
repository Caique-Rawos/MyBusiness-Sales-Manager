import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../test/query-wrapper'
import { useLogin, useSignup } from './hooks'
import { useAuth } from '../../shared/context/AuthContext'

vi.mock('../../shared/context/AuthContext', () => ({ useAuth: vi.fn() }))

describe('auth hooks', () => {
  const login = vi.fn()
  const signup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({ login, signup } as unknown as ReturnType<typeof useAuth>)
  })

  it('useLogin should call AuthContext.login with email and senha', async () => {
    login.mockResolvedValue(undefined)
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper })

    result.current.mutate({ email: 'a@a.com', senha: '123456' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(login).toHaveBeenCalledWith('a@a.com', '123456')
  })

  it('useSignup should call AuthContext.signup with the full payload', async () => {
    signup.mockResolvedValue(undefined)
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useSignup(), { wrapper: Wrapper })
    const payload = {
      nome: 'Fulano',
      email: 'a@a.com',
      senha: '123456',
      nomeFantasia: 'Loja',
      cpfCnpj: '123',
      endereco: 'Rua A',
    }

    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(signup).toHaveBeenCalledWith(payload)
  })
})
