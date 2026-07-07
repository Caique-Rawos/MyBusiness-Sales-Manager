import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { regraFiscalApi } from './api'

describe('regraFiscalApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /regra-fiscal and unwrap data', async () => {
    mock.onGet('/regra-fiscal').reply(200, [{ id: 1 }])
    await expect(regraFiscalApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /regra-fiscal', async () => {
    mock.onPost('/regra-fiscal').reply(201, { id: 1 })
    await expect(
      regraFiscalApi.create({ descricao: 'Tributado', ncm: '1234', icms: 18, pis: 1.65, cofins: 7.6, ipi: 0 }),
    ).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /regra-fiscal/:id', async () => {
    mock.onPut('/regra-fiscal/1').reply(200, { id: 1 })
    await expect(regraFiscalApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /regra-fiscal/:id', async () => {
    mock.onDelete('/regra-fiscal/1').reply(200)
    await regraFiscalApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
