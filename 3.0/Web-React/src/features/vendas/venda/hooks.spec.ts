import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useVendas, useCreateVenda, useDeleteVenda, useRelatorio, useRelatorioCliente, useRelatorioData } from './hooks'
import { vendaApi, relatorioApi } from './api'
import type { Venda } from './types'

vi.mock('./api', () => ({
  vendaApi: { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() },
  relatorioApi: { getByRange: vi.fn(), getByCliente: vi.fn(), getByData: vi.fn() },
}))

const venda = { id: 1, totalVenda: '100.00', dataVenda: '2026-01-01' } as Venda

describe('venda hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useVendas should fetch the list', async () => {
    vi.mocked(vendaApi.getAll).mockResolvedValue([venda])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useVendas(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([venda])
  })

  it('useCreateVenda should call the api and invalidate the list', async () => {
    vi.mocked(vendaApi.create).mockResolvedValue(venda)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateVenda(), { wrapper: Wrapper })

    result.current.mutate({ idCliente: 1 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(vendaApi.create).mock.calls[0][0]).toEqual({ idCliente: 1 })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['vendas'] })
  })

  it('useDeleteVenda should call the api and invalidate the list', async () => {
    vi.mocked(vendaApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteVenda(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(vendaApi.delete).mock.calls[0][0]).toBe(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['vendas'] })
  })

  it('useRelatorio should stay disabled until both dates are provided', () => {
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRelatorio('', ''), { wrapper: Wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(relatorioApi.getByRange).not.toHaveBeenCalled()
  })

  it('useRelatorio should fetch once both dates are provided', async () => {
    vi.mocked(relatorioApi.getByRange).mockResolvedValue({ vendas: [], totalVendas: 0 })
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRelatorio('2026-01-01', '2026-01-31'), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(relatorioApi.getByRange).toHaveBeenCalledWith('2026-01-01', '2026-01-31')
  })

  it('useRelatorioCliente should fetch the cliente breakdown', async () => {
    vi.mocked(relatorioApi.getByCliente).mockResolvedValue({ vendas: [], totalVendas: 0, quantidadeTotal: 0 })
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRelatorioCliente('2026-01-01', '2026-01-31'), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(relatorioApi.getByCliente).toHaveBeenCalledWith('2026-01-01', '2026-01-31')
  })

  it('useRelatorioData should fetch the daily breakdown', async () => {
    vi.mocked(relatorioApi.getByData).mockResolvedValue({ datas: [], totalVendas: 0, totalClientes: 0 })
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useRelatorioData('2026-01-01', '2026-01-31'), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(relatorioApi.getByData).toHaveBeenCalledWith('2026-01-01', '2026-01-31')
  })
})
