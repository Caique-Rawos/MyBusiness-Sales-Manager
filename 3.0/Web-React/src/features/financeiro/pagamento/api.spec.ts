import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { pagamentoApi } from './api'

describe('pagamentoApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /pagamento and unwrap data', async () => {
    mock.onGet('/pagamento').reply(200, [{ id: 1 }])
    await expect(pagamentoApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /pagamento', async () => {
    mock.onPost('/pagamento').reply(201, { id: 1, descricao: 'Dinheiro' })
    await expect(pagamentoApi.create({ descricao: 'Dinheiro' })).resolves.toEqual({ id: 1, descricao: 'Dinheiro' })
  })

  it('update should PUT /pagamento/:id', async () => {
    mock.onPut('/pagamento/1').reply(200, { id: 1, descricao: 'Novo' })
    await expect(pagamentoApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1, descricao: 'Novo' })
  })

  it('delete should DELETE /pagamento/:id', async () => {
    mock.onDelete('/pagamento/1').reply(200)
    await pagamentoApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
