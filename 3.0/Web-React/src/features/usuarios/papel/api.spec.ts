import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { papelApi, permissaoApi } from './api'

describe('papelApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /papeis and unwrap data', async () => {
    mock.onGet('/papeis').reply(200, [{ id: 1 }])
    await expect(papelApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /papeis', async () => {
    mock.onPost('/papeis').reply(201, { id: 1 })
    await expect(papelApi.create({ nome: 'Admin', permissaoIds: [1] })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /papeis/:id', async () => {
    mock.onPut('/papeis/1').reply(200, { id: 1 })
    await expect(papelApi.update(1, { nome: 'Novo' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /papeis/:id', async () => {
    mock.onDelete('/papeis/1').reply(200)
    await papelApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})

describe('permissaoApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /permissoes and unwrap data', async () => {
    mock.onGet('/permissoes').reply(200, [{ id: 1, chave: 'venda:listar' }])
    await expect(permissaoApi.getAll()).resolves.toEqual([{ id: 1, chave: 'venda:listar' }])
  })
})
