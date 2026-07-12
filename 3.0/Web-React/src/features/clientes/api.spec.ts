import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../shared/api/http'
import { clienteApi } from './api'

describe('clienteApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /cliente and unwrap data', async () => {
    mock.onGet('/cliente').reply(200, [{ id: 1 }])
    await expect(clienteApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('getById should GET /cliente/:id', async () => {
    mock.onGet('/cliente/1').reply(200, { id: 1 })
    await expect(clienteApi.getById(1)).resolves.toEqual({ id: 1 })
  })

  it('create should POST /cliente with the payload', async () => {
    mock.onPost('/cliente').reply(201, { id: 1, nome: 'Fulano' })
    await expect(clienteApi.create({ nome: 'Fulano', cpfCnpj: '123' })).resolves.toEqual({
      id: 1,
      nome: 'Fulano',
    })
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ nome: 'Fulano', cpfCnpj: '123' })
  })

  it('update should PUT /cliente/:id with the payload', async () => {
    mock.onPut('/cliente/1').reply(200, { id: 1, nome: 'Novo' })
    await expect(clienteApi.update(1, { nome: 'Novo' })).resolves.toEqual({ id: 1, nome: 'Novo' })
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ nome: 'Novo' })
  })

  it('delete should DELETE /cliente/:id', async () => {
    mock.onDelete('/cliente/1').reply(200)
    await clienteApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
