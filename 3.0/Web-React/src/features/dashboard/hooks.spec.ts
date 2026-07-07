import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '../../test/query-wrapper'
import { useDashboard } from './hooks'
import { dashboardApi } from './api'
import type { PrevisaoVenda } from './types'

vi.mock('./api', () => ({ dashboardApi: { getPrevisao: vi.fn() } }))

describe('useDashboard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should fetch the sales forecast', async () => {
    const previsao: PrevisaoVenda[] = [{ mes: '01-2026', valorTotal: 100, quantidadeVendas: 2 }]
    vi.mocked(dashboardApi.getPrevisao).mockResolvedValue(previsao)
    const { Wrapper } = createQueryWrapper()

    const { result } = renderHook(() => useDashboard(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(previsao)
  })
})
