import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { usePagamentos, useCreatePagamento, useUpdatePagamento, useDeletePagamento } from './hooks'
import { pagamentoApi } from './api'
import type { Pagamento } from './types'

vi.mock('./api', () => ({
  pagamentoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const pagamento: Pagamento = { id: 1, descricao: 'Dinheiro' }

describe('pagamento hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('usePagamentos should fetch the list', async () => {
    vi.mocked(pagamentoApi.getAll).mockResolvedValue([pagamento])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => usePagamentos(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([pagamento])
  })

  it('useCreatePagamento should call the api and invalidate the list', async () => {
    vi.mocked(pagamentoApi.create).mockResolvedValue(pagamento)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreatePagamento(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Dinheiro' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(pagamentoApi.create).mock.calls[0][0]).toEqual({ descricao: 'Dinheiro' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pagamentos'] })
  })

  it('useUpdatePagamento should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(pagamentoApi.update).mockResolvedValue(pagamento)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdatePagamento(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(pagamentoApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pagamentos'] })
  })

  it('useDeletePagamento should call the api and invalidate the list', async () => {
    vi.mocked(pagamentoApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeletePagamento(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(pagamentoApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pagamentos'] })
  })
})
