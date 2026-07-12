import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useVendaItens, useCreateVendaItem, useDeleteVendaItem } from './hooks'
import { vendaItemApi } from './api'
import type { VendaItem } from './types'

vi.mock('./api', () => ({
  vendaItemApi: { getByVenda: vi.fn(), create: vi.fn(), delete: vi.fn() },
}))

const item = { id: 1, precoUnitario: '10.00', desconto: '0', quantidade: '2', subTotal: '20.00' } as VendaItem

describe('venda-item hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useVendaItens should stay disabled without an idVenda', () => {
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useVendaItens(0), { wrapper: Wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(vendaItemApi.getByVenda).not.toHaveBeenCalled()
  })

  it('useVendaItens should fetch items for the given venda', async () => {
    vi.mocked(vendaItemApi.getByVenda).mockResolvedValue([item])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useVendaItens(1), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([item])
    expect(vendaItemApi.getByVenda).toHaveBeenCalledWith(1)
  })

  it('useCreateVendaItem should call the api and invalidate the itens of that venda', async () => {
    vi.mocked(vendaItemApi.create).mockResolvedValue(item)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateVendaItem(1), { wrapper: Wrapper })

    result.current.mutate({ idVenda: 1, idProduto: 1, quantidade: 2 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(vendaItemApi.create).mock.calls[0][0]).toEqual({ idVenda: 1, idProduto: 1, quantidade: 2 })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['venda-itens', 1] })
  })

  it('useDeleteVendaItem should call the api and invalidate the itens of that venda', async () => {
    vi.mocked(vendaItemApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteVendaItem(1), { wrapper: Wrapper })

    result.current.mutate(5)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(vendaItemApi.delete).mock.calls[0][0]).toBe(5)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['venda-itens', 1] })
  })
})
