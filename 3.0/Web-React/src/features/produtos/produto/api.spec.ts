import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { produtoApi } from './api'

describe('produtoApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /produto and unwrap data', async () => {
    mock.onGet('/produto').reply(200, [{ id: 1 }])
    await expect(produtoApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /produto', async () => {
    mock.onPost('/produto').reply(201, { id: 1 })
    await expect(produtoApi.create({ descricao: 'Produto' })).resolves.toEqual({ id: 1 })
  })

  it('update should PUT /produto/:id', async () => {
    mock.onPut('/produto/1').reply(200, { id: 1 })
    await expect(produtoApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /produto/:id', async () => {
    mock.onDelete('/produto/1').reply(200)
    await produtoApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
