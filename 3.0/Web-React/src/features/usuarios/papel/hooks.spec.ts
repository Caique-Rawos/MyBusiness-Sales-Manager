import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { usePapeis, usePermissoes, useCreatePapel, useUpdatePapel, useDeletePapel } from './hooks'
import { papelApi, permissaoApi } from './api'
import type { Papel, PermissaoResumo } from './types'

vi.mock('./api', () => ({
  papelApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  permissaoApi: { getAll: vi.fn() },
}))

const papel: Papel = { id: 1, nome: 'Admin', tenantId: 1, permissoes: [] }
const permissao: PermissaoResumo = { id: 1, chave: 'venda:listar', descricao: 'Listar vendas' }

describe('papel hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('usePapeis should fetch the list', async () => {
    vi.mocked(papelApi.getAll).mockResolvedValue([papel])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => usePapeis(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([papel])
  })

  it('usePermissoes should fetch the permission catalog', async () => {
    vi.mocked(permissaoApi.getAll).mockResolvedValue([permissao])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => usePermissoes(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([permissao])
  })

  it('useCreatePapel should call the api and invalidate the papeis list', async () => {
    vi.mocked(papelApi.create).mockResolvedValue(papel)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreatePapel(), { wrapper: Wrapper })

    result.current.mutate({ nome: 'Admin', permissaoIds: [1] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(papelApi.create).mock.calls[0][0]).toEqual({ nome: 'Admin', permissaoIds: [1] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['papeis'] })
  })

  it('useUpdatePapel should call the api with id and data, and invalidate the papeis list', async () => {
    vi.mocked(papelApi.update).mockResolvedValue(papel)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdatePapel(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { nome: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(papelApi.update).toHaveBeenCalledWith(1, { nome: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['papeis'] })
  })

  it('useDeletePapel should call the api and invalidate the papeis list', async () => {
    vi.mocked(papelApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeletePapel(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(papelApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['papeis'] })
  })
})
