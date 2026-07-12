import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../test/query-wrapper'
import { useLoja, useSaveLoja } from './hooks'
import { lojaApi } from './api'
import type { Loja } from './types'

vi.mock('./api', () => ({
  lojaApi: { getAll: vi.fn(), create: vi.fn(), update: vi.fn() },
}))

const loja: Loja = { id: 1, nomeFantasia: 'Minha Loja', cpfCnpj: '12345678900', endereco: 'Rua A, 1' }

describe('loja hooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useLoja should fetch the loja', async () => {
    vi.mocked(lojaApi.getAll).mockResolvedValue([loja])
    const { Wrapper } = createQueryWrapper()
    const { result } = renderHook(() => useLoja(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([loja])
  })

  it('useSaveLoja should create when no loja is passed', async () => {
    vi.mocked(lojaApi.create).mockResolvedValue(loja)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useSaveLoja(), { wrapper: Wrapper })

    result.current.mutate({ loja: undefined, data: { nomeFantasia: 'Minha Loja' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(lojaApi.create).toHaveBeenCalledWith({ nomeFantasia: 'Minha Loja' })
    expect(lojaApi.update).not.toHaveBeenCalled()
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['loja'] })
  })

  it('useSaveLoja should update when an existing loja is passed', async () => {
    vi.mocked(lojaApi.update).mockResolvedValue(loja)
    const { Wrapper, queryClient } = createQueryWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(() => useSaveLoja(), { wrapper: Wrapper })

    result.current.mutate({ loja, data: { nomeFantasia: 'Nome novo' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(lojaApi.update).toHaveBeenCalledWith(1, { nomeFantasia: 'Nome novo' })
    expect(lojaApi.create).not.toHaveBeenCalled()
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['loja'] })
  })
})
