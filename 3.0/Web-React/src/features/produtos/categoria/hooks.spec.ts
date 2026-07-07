import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from './hooks'
import { categoriaApi } from './api'
import type { Categoria } from './types'

vi.mock('./api', () => ({
  categoriaApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))

const categoria: Categoria = { id: 1, descricao: 'Bebidas' }

describe('categoria hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useCategorias should fetch the list', async () => {
    vi.mocked(categoriaApi.getAll).mockResolvedValue([categoria])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useCategorias(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([categoria])
  })

  it('useCreateCategoria should call the api and invalidate the list', async () => {
    vi.mocked(categoriaApi.create).mockResolvedValue(categoria)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useCreateCategoria(), { wrapper: Wrapper })

    result.current.mutate({ descricao: 'Bebidas' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(categoriaApi.create).toHaveBeenCalledWith({ descricao: 'Bebidas' }, expect.anything())
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categorias'] })
  })

  it('useUpdateCategoria should call the api with id and data, and invalidate the list', async () => {
    vi.mocked(categoriaApi.update).mockResolvedValue(categoria)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateCategoria(), { wrapper: Wrapper })

    result.current.mutate({ id: 1, data: { descricao: 'Novo nome' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(categoriaApi.update).toHaveBeenCalledWith(1, { descricao: 'Novo nome' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categorias'] })
  })

  it('useDeleteCategoria should call the api and invalidate the list', async () => {
    vi.mocked(categoriaApi.delete).mockResolvedValue(undefined)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useDeleteCategoria(), { wrapper: Wrapper })

    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(categoriaApi.delete).toHaveBeenCalledWith(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categorias'] })
  })
})
