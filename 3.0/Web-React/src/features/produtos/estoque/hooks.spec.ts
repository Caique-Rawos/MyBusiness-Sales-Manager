import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../../test/query-wrapper'
import { useMovimentosEstoque } from './hooks'
import { estoqueApi } from './api'
import type { MovimentoEstoque } from './types'

vi.mock('./api', () => ({ estoqueApi: { getAll: vi.fn() } }))

const movimento: MovimentoEstoque = {
  id: 1,
  tipo: 'ENTRADA',
  quantidade: 10,
  idProduto: 1,
  dataMovimento: '2026-01-01',
}

describe('useMovimentosEstoque', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should fetch movements applying the filtro', async () => {
    vi.mocked(estoqueApi.getAll).mockResolvedValue([movimento])
    const { Wrapper } = createQueryWrapper()
    const filtro = { idProduto: 1 }

    const { result } = renderHook(() => useMovimentosEstoque(filtro), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([movimento])
    expect(estoqueApi.getAll).toHaveBeenCalledWith(filtro)
  })
})
