import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { categoriaApi } from './api'

describe('categoriaApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /categoria and unwrap data', async () => {
    mock.onGet('/categoria').reply(200, [{ id: 1 }])
    await expect(categoriaApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /categoria', async () => {
    mock.onPost('/categoria').reply(201, { id: 1, descricao: 'Bebidas' })
    await expect(categoriaApi.create({ descricao: 'Bebidas' })).resolves.toEqual({ id: 1, descricao: 'Bebidas' })
  })

  it('update should PUT /categoria/:id', async () => {
    mock.onPut('/categoria/1').reply(200, { id: 1, descricao: 'Novo' })
    await expect(categoriaApi.update(1, { descricao: 'Novo' })).resolves.toEqual({ id: 1, descricao: 'Novo' })
  })

  it('delete should DELETE /categoria/:id', async () => {
    mock.onDelete('/categoria/1').reply(200)
    await categoriaApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
