import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useUsuarios, useCreateUsuario, useUpdateUsuarioPapeis, useDeleteUsuario } from './hooks'
import { usuarioApi } from './api'
import type { Usuario } from './types'

vi.mock('./api', () => ({
  usuarioApi: { getAll: vi.fn(), create: vi.fn(), updatePapeis: vi.fn(), delete: vi.fn() },
}))

const usuario: Usuario = {
  id: 1,
  nome: 'Fulano',
  email: 'fulano@teste.com',
  tenantId: 1,
  ativo: true,
  isOwner: false,
  criadoEm: '2026-01-01',
  papeis: [],
}

describe('usuario hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useUsuarios should fetch the list', async () => {
    vi.mocked(usuarioApi.getAll).mockResolvedValue([usuario])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useUsuarios(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([usuario])
  })

  it('useCreateUsuario should call the api and invalidate the list', async () => {
    vi.mocked(usuarioApi.create).mockResolvedValue(usuario)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateUsuario(), { wrapper: Wrapper })

    result.current.mutate({ nome: 'Fulano', email: 'fulano@teste.com', senha: '123456', papelIds: [] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(usuarioApi.create).toHaveBeenCalledWith({
      nome: 'Fulano',
      email: 'fulano@teste.com',
      senha: '123456',
      papelIds: [],
    })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['usuarios'] })
  })

  it('useUpdateUsuarioPapeis should call the api with id and papelIds, and invalidate the list', async () => {
    vi.mocked(usuarioApi.updatePapeis).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateUsuarioPapeis(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, papelIds: [2, 3] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(usuarioApi.updatePapeis).toHaveBeenCalledWith(1, [2, 3])
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['usuarios'] })
  })

  it('useDeleteUsuario should call the api and invalidate the list', async () => {
    vi.mocked(usuarioApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteUsuario(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(usuarioApi.delete).toHaveBeenCalledWith(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['usuarios'] })
  })
})
