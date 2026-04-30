import { VendaRelatorioService } from './venda_relatorio.service';

let repository: any;
let lojaService: any;
let service: VendaRelatorioService;

describe('VendaRelatorioService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      findToday: jest.fn(),
      findByAlias: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      findAllGroupByCliente: jest.fn(),
      findAllGroupByData: jest.fn(),
      getCupomItens: jest.fn(),
      atualizaTotal: jest.fn(),
      atualizaEstoque: jest.fn(),
    };
    lojaService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      findToday: jest.fn(),
      findByAlias: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      findAllGroupByCliente: jest.fn(),
      findAllGroupByData: jest.fn(),
      getCupomItens: jest.fn(),
      atualizaTotal: jest.fn(),
      atualizaEstoque: jest.fn(),
    };
    service = new VendaRelatorioService(repository, lojaService as any);
  });

  it('should find all', async () => {
    const expected = { vendas: [], totalVendas: 0 };
    repository.findAll.mockResolvedValue([]);
    await expect(service.findAll({} as any)).resolves.toEqual(expected);
    expect(repository.findAll).toHaveBeenCalledWith({} as any);
  });

  it('should group vendas by cliente', async () => {
    repository.findAllGroupByCliente.mockResolvedValue([
      {
        idCliente: 1,
        nomeCliente: 'Cliente',
        valorVendas: '100',
        quantidadeVendas: '2',
      },
    ] as any);
    const result = await service.findAllGroupByCliente({} as any);
    expect(result.totalVendas).toBe(100);
    expect(result.quantidadeTotal).toBe(2);
  });

  it('should group vendas by date', async () => {
    repository.findAllGroupByData.mockResolvedValue([
      { data: '2024-01-01', totalVendas: '100', contagemCliente: '4' },
    ] as any);
    const result = await service.findAllGroupByData({} as any);
    expect(result.totalVendas).toBe(100);
    expect(result.totalClientes).toBe(2);
  });
});
