import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { statusPagamentoApi } from './api'

describe('statusPagamentoApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /status-pagamento and unwrap data', async () => {
    mock.onGet('/status-pagamento').reply(200, [{ id: 1 }])
    await expect(statusPagamentoApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /status-pagamento', async () => {
    mock.onPost('/status-pagamento').reply(201, { id: 1 })
    await expect(statusPagamentoApi.create({ descricao: 'Pago', cor: '#22c55e' })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /status-pagamento/:id', async () => {
    mock.onPut('/status-pagamento/1').reply(200, { id: 1 })
    await expect(statusPagamentoApi.update(1, { descricao: 'Novo', cor: '#000' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /status-pagamento/:id', async () => {
    mock.onDelete('/status-pagamento/1').reply(200)
    await statusPagamentoApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
