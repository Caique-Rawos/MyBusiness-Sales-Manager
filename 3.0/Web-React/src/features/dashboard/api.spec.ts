import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../shared/api/http'
import { dashboardApi } from './api'

describe('dashboardApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getPrevisao should GET /venda/previsao-venda and unwrap data', async () => {
    mock.onGet('/venda/previsao-venda').reply(200, [{ mes: '01-2026', valorTotal: 100, quantidadeVendas: 1 }])
    await expect(dashboardApi.getPrevisao()).resolves.toEqual([{ mes: '01-2026', valorTotal: 100, quantidadeVendas: 1 }])
  })
})
