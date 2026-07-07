import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../test/query-wrapper'
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from './hooks'
import { clienteApi } from './api'
import type { Cliente } from './types'

vi.mock('./api', () => ({
  clienteApi: { getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const cliente: Cliente = { id: 1, nome: 'Fulano', cpfCnpj: '12345678900' }

describe('clientes hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('useClientes should fetch the list', async () => {
    vi.mocked(clienteApi.getAll).mockResolvedValue([cliente])
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useClientes(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([cliente])
  })

  it('useCreateCliente should call the api and invalidate the list', async () => {
    vi.mocked(clienteApi.create).mockResolvedValue(cliente)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateCliente(), { wrapper: Wrapper })
    result.current.mutate({ nome: 'Fulano', cpfCnpj: '12345678900' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clienteApi.create).toHaveBeenCalledWith(
      { nome: 'Fulano', cpfCnpj: '12345678900' },
      expect.anything(),
    )
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['clientes'] })
  })

  it('useUpdateCliente should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(clienteApi.update).mockResolvedValue(cliente)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateCliente(), { wrapper: Wrapper })
    result.current.mutate({ id: 1, data: { nome: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clienteApi.update).toHaveBeenCalledWith(1, { nome: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['clientes'] })
  })

  it('useDeleteCliente should call the api and invalidate the list', async () => {
    vi.mocked(clienteApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useDeleteCliente(), { wrapper: Wrapper })
    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(clienteApi.delete).toHaveBeenCalledWith(1, expect.anything())
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['clientes'] })
  })
})
