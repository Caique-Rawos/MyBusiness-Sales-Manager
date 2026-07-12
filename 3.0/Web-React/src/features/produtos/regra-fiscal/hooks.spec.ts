import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useRegrasFiscais, useCreateRegraFiscal, useUpdateRegraFiscal, useDeleteRegraFiscal } from './hooks'
import { regraFiscalApi } from './api'
import type { RegraFiscal } from './types'

vi.mock('./api', () => ({
  regraFiscalApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const regraFiscal: RegraFiscal = { id: 1, descricao: 'Tributado', ncm: '1234.56.78', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }

describe('regra fiscal hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useRegrasFiscais should fetch the list', async () => {
    vi.mocked(regraFiscalApi.getAll).mockResolvedValue([regraFiscal])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRegrasFiscais(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([regraFiscal])
  })

  it('useCreateRegraFiscal should call the api and invalidate the list', async () => {
    vi.mocked(regraFiscalApi.create).mockResolvedValue(regraFiscal)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateRegraFiscal(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Tributado' } as never)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(regraFiscalApi.create).mock.calls[0][0]).toEqual({ descricao: 'Tributado' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['regras-fiscais'] })
  })

  it('useUpdateRegraFiscal should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(regraFiscalApi.update).mockResolvedValue(regraFiscal)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateRegraFiscal(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } as never })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(regraFiscalApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['regras-fiscais'] })
  })

  it('useDeleteRegraFiscal should call the api and invalidate the list', async () => {
    vi.mocked(regraFiscalApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteRegraFiscal(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(regraFiscalApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['regras-fiscais'] })
  })
})
