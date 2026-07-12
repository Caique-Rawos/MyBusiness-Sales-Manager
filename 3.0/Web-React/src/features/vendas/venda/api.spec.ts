import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import http from '../../../shared/api/http'
import { vendaApi, relatorioApi } from './api'

describe('vendaApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getAll should GET /venda and unwrap data', async () => {
    mock.onGet('/venda').reply(200, [{ id: 1 }])
    await expect(vendaApi.getAll()).resolves.toEqual([{ id: 1 }])
  })

  it('create should POST /venda', async () => {
    mock.onPost('/venda').reply(201, { id: 1 })
    await expect(vendaApi.create({ idCliente: 1 })).resolves.toEqual({ id: 1 })
  })

  it('delete should DELETE /venda/:id', async () => {
    mock.onDelete('/venda/1').reply(200)
    await vendaApi.delete(1)
    expect(mock.history.delete).toHaveLength(1)
  })
})

describe('relatorioApi', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(http)
  })

  afterEach(() => {
    mock.restore()
  })

  it('getByRange should GET /venda-relatorio with the date range', async () => {
    mock.onGet('/venda-relatorio?dataInicio=2026-01-01&dataFim=2026-01-31').reply(200, { vendas: [], totalVendas: 0 })
    await expect(relatorioApi.getByRange('2026-01-01', '2026-01-31')).resolves.toEqual({ vendas: [], totalVendas: 0 })
  })

  it('getByCliente should GET /venda-relatorio/cliente with the date range', async () => {
    mock
      .onGet('/venda-relatorio/cliente?dataInicio=2026-01-01&dataFim=2026-01-31')
      .reply(200, { vendas: [], totalVendas: 0, quantidadeTotal: 0 })
    await expect(relatorioApi.getByCliente('2026-01-01', '2026-01-31')).resolves.toEqual({
      vendas: [],
      totalVendas: 0,
      quantidadeTotal: 0,
    })
  })

  it('getByData should GET /venda-relatorio/data with the date range', async () => {
    mock
      .onGet('/venda-relatorio/data?dataInicio=2026-01-01&dataFim=2026-01-31')
      .reply(200, { datas: [], totalVendas: 0, totalClientes: 0 })
    await expect(relatorioApi.getByData('2026-01-01', '2026-01-31')).resolves.toEqual({
      datas: [],
      totalVendas: 0,
      totalClientes: 0,
    })
  })
})
