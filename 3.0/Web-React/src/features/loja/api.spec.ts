import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../shared/api/http'
import { lojaApi } from './api'

describe('lojaApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /loja and unwrap data', async () => {
    mock.onGet('/loja').reply(200, [{ id: 1 }])
    await expect(lojaApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /loja', async () => {
    mock.onPost('/loja').reply(201, { id: 1 })
    await expect(lojaApi.create({ nomeFantasia: 'Loja', cpfCnpj: '123', endereco: 'Rua A' })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /loja/:id', async () => {
    mock.onPut('/loja/1').reply(200, { id: 1 })
    await expect(lojaApi.update(1, { nomeFantasia: 'Novo' })).resolves.toEqual({ id: 1 })
  })
})
