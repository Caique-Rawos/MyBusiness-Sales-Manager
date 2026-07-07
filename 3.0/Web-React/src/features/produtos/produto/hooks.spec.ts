import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from './hooks'
import { produtoApi } from './api'
import type { Produto } from './types'

vi.mock('./api', () => ({
  produtoApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const produto = {
  id: 1,
  descricao: 'Produto Teste',
  valorCusto: '10.00',
  valorVenda: '20.00',
  estoque: 5,
} as Produto

describe('produto hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useProdutos should fetch the list', async () => {
    vi.mocked(produtoApi.getAll).mockResolvedValue([produto])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useProdutos(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([produto])
  })

  it('useCreateProduto should call the api and invalidate the list', async () => {
    vi.mocked(produtoApi.create).mockResolvedValue(produto)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateProduto(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Produto Teste' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(produtoApi.create).mock.calls[0][0]).toEqual({ descricao: 'Produto Teste' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['produtos'] })
  })

  it('useUpdateProduto should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(produtoApi.update).mockResolvedValue(produto)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateProduto(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(produtoApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['produtos'] })
  })

  it('useDeleteProduto should call the api and invalidate the list', async () => {
    vi.mocked(produtoApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteProduto(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(produtoApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['produtos'] })
  })
})
