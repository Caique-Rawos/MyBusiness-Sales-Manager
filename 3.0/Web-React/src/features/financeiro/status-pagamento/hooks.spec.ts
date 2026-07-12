import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import {
  useStatusPagamentos,
  useCreateStatusPagamento,
  useUpdateStatusPagamento,
  useDeleteStatusPagamento,
} from './hooks'
import { statusPagamentoApi } from './api'
import type { StatusPagamento } from './types'

vi.mock('./api', () => ({
  statusPagamentoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const status: StatusPagamento = { id: 1, descricao: 'Pago', cor: '#22c55e' }

describe('status pagamento hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useStatusPagamentos should fetch the list', async () => {
    vi.mocked(statusPagamentoApi.getAll).mockResolvedValue([status])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useStatusPagamentos(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([status])
  })

  it('useCreateStatusPagamento should call the api and invalidate the list', async () => {
    vi.mocked(statusPagamentoApi.create).mockResolvedValue(status)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateStatusPagamento(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Pago', cor: '#22c55e' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(statusPagamentoApi.create).mock.calls[0][0]).toEqual({ descricao: 'Pago', cor: '#22c55e' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['status-pagamento'] })
  })

  it('useUpdateStatusPagamento should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(statusPagamentoApi.update).mockResolvedValue(status)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateStatusPagamento(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome', cor: '#000' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(statusPagamentoApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome', cor: '#000' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['status-pagamento'] })
  })

  it('useDeleteStatusPagamento should call the api and invalidate the list', async () => {
    vi.mocked(statusPagamentoApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteStatusPagamento(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(statusPagamentoApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['status-pagamento'] })
  })
})
