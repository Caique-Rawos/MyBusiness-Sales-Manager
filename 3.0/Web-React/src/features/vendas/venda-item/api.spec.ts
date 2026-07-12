import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { vendaItemApi } from './api'

describe('vendaItemApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getByVenda should GET /venda-item/venda with the idVenda query', async () => {
    mock.onGet('/venda-item/venda?id_venda=1').reply(200, [{ id: 1 }])
    await expect(vendaItemApi.getByVenda(1)).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /venda-item', async () => {
    mock.onPost('/venda-item').reply(201, { id: 1 })
    await expect(vendaItemApi.create({ idVenda: 1, idProduto: 1, quantidade: 2 })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /venda-item/:id', async () => {
    mock.onDelete('/venda-item/1').reply(200)
    await vendaItemApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})
