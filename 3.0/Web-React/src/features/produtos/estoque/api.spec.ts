import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { estoqueApi } from './api'

describe('estoqueApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /estoque with no query params when filtro is empty', async () => {
    mock.onGet('/estoque?').reply(200, [])
    await expect(estoqueApi.getAll({})).resolves.toEqual([])
  })

  it('getAll should build the query string from the filtro', async () => {
    mock.onGet('/estoque?dataInicio=2026-01-01&dataFim=2026-01-31&idProduto=1').reply(200, [{ id: 1 }])
    await expect(
      estoqueApi.getAll({ dataInicio: '2026-01-01', dataFim: '2026-01-31', idProduto: 1 }),
    ).resolves.toEqual([{ id: 1 }])
  })
})
