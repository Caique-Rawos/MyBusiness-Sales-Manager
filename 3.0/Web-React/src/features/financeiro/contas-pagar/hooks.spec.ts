import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useContasPagar, useCreateContasPagar, useUpdateContasPagar, useDeleteContasPagar } from './hooks'
import { contasPagarApi } from './api'
import type { ContasPagar } from './types'

vi.mock('./api', () => ({
  contasPagarApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const conta = { id: 1, descricao: 'Aluguel', valorTotal: '100.00', valorPago: '0.00' } as ContasPagar

describe('contas a pagar hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useContasPagar should fetch the list', async () => {
    vi.mocked(contasPagarApi.getAll).mockResolvedValue([conta])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useContasPagar(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([conta])
  })

  it('useCreateContasPagar should call the api and invalidate the list', async () => {
    vi.mocked(contasPagarApi.create).mockResolvedValue(conta)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateContasPagar(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Aluguel' } as never)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(contasPagarApi.create).mock.calls[0][0]).toEqual({ descricao: 'Aluguel' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-pagar'] })
  })

  it('useUpdateContasPagar should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(contasPagarApi.update).mockResolvedValue(conta)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateContasPagar(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(contasPagarApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-pagar'] })
  })

  it('useDeleteContasPagar should call the api and invalidate the list', async () => {
    vi.mocked(contasPagarApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteContasPagar(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(contasPagarApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-pagar'] })
  })
})
