import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { contasReceberApi } from './api'

describe('contasReceberApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /contas-receber and unwrap data', async () => {
    mock.onGet('/contas-receber').reply(200, [{ id: 1 }])
    await expect(contasReceberApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /contas-receber', async () => {
    mock.onPost('/contas-receber').reply(201, { id: 1 })
    await expect(contasReceberApi.create({ descricao: 'Venda #1' })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /contas-receber/:id', async () => {
    mock.onPut('/contas-receber/1').reply(200, { id: 1 })
    await expect(contasReceberApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /contas-receber/:id', async () => {
    mock.onDelete('/contas-receber/1').reply(200)
    await contasReceberApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
