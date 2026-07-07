import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useContasReceber, useCreateContasReceber, useUpdateContasReceber, useDeleteContasReceber } from './hooks'
import { contasReceberApi } from './api'
import type { ContasReceber } from './types'

vi.mock('./api', () => ({
  contasReceberApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const conta = { id: 1, descricao: 'Venda #1', valorTotal: '100.00', valorPago: '0.00' } as ContasReceber

describe('contas a receber hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useContasReceber should fetch the list', async () => {
    vi.mocked(contasReceberApi.getAll).mockResolvedValue([conta])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useContasReceber(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([conta])
  })

  it('useCreateContasReceber should call the api and invalidate the list', async () => {
    vi.mocked(contasReceberApi.create).mockResolvedValue(conta)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateContasReceber(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Venda #1' } as never)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(contasReceberApi.create).mock.calls[0][0]).toEqual({ descricao: 'Venda #1' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-receber'] })
  })

  it('useUpdateContasReceber should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(contasReceberApi.update).mockResolvedValue(conta)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateContasReceber(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(contasReceberApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-receber'] })
  })

  it('useDeleteContasReceber should call the api and invalidate the list', async () => {
    vi.mocked(contasReceberApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteContasReceber(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(contasReceberApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['contas-receber'] })
  })
})
