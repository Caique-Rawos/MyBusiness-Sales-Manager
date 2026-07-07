import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { usuarioApi } from './api'

describe('usuarioApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /usuarios and unwrap data', async () => {
    mock.onGet('/usuarios').reply(200, [{ id: 1 }])
    await expect(usuarioApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /usuarios', async () => {
    mock.onPost('/usuarios').reply(201, { id: 1 })
    await expect(usuarioApi.create({ nome: 'Fulano', email: 'a@a.com', senha: '123456', papelIds: [] })).resolves.toEqual({ id: 1 })
  })

  it('updatePapeis should PUT /usuarios/:id/papeis with papelIds', async () => {
    mock.onPut('/usuarios/1/papeis').reply(200, { id: 1 })
    await expect(usuarioApi.updatePapeis(1, [1, 2])).resolves.toEqual({ id: 1 })
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ papelIds: [1, 2] })
  })

  it('delete should DELETE /usuarios/:id', async () => {
    mock.onDelete('/usuarios/1').reply(200)
    await usuarioApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
