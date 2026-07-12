import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { contasPagarApi } from './api'

describe('contasPagarApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /contas-pagar and unwrap data', async () => {
    mock.onGet('/contas-pagar').reply(200, [{ id: 1 }])
    await expect(contasPagarApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /contas-pagar', async () => {
    mock.onPost('/contas-pagar').reply(201, { id: 1 })
    await expect(contasPagarApi.create({ descricao: 'Aluguel' })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /contas-pagar/:id', async () => {
    mock.onPut('/contas-pagar/1').reply(200, { id: 1 })
    await expect(contasPagarApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /contas-pagar/:id', async () => {
    mock.onDelete('/contas-pagar/1').reply(200)
    await contasPagarApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
