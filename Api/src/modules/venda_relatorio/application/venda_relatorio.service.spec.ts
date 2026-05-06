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

  it('should find all without vendas', async () => {
    const expected = { vendas: [], totalVendas: 0 };
    repository.findAll.mockResolvedValue([]);
    await expect(service.findAll({} as any)).resolves.toEqual(expected);
    expect(repository.findAll).toHaveBeenCalledWith({} as any);
  });

  it('should find all', async () => {
    const expected = {
      vendas: [
        {
          dataVenda: new Date('2024-01-01'),
          idCliente: 1,
          idVenda: 1,
          nomeCliente: 'Cliente',
          valorVenda: 1,
        },
      ],
      totalVendas: 1,
    };
    repository.findAll.mockResolvedValue([
      {
        id: 1,
        totalVenda: 1,
        dataVenda: new Date('2024-01-01'),
        cliente: { id: 1, nome: 'Cliente' },
      },
    ]);
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

  it('should group vendas by date', async () => {
    repository.findAllGroupByData.mockResolvedValue([
      { data: '2024-01-01', totalVendas: '100', contagemCliente: undefined },
    ] as any);
    const result = await service.findAllGroupByData({} as any);
    expect(result.totalVendas).toBe(100);
    expect(result.totalClientes).toBe(0);
  });

  it('should generate a fiscal coupon summary', async () => {
    lojaService.findById.mockResolvedValue({ id: 1, nome: 'Loja' } as any);
    repository.getCupomItens.mockResolvedValue([
      {
        subTotal: '100',
        icms: '10',
        pis: '1',
        cofins: '2',
        ipi: '3',
      },
      {
        subtotal: '200',
        icms: '5',
        pis: '1',
        cofins: '2',
        ipi: '4',
      },
    ] as any);

    const result = await service.generateCupomFiscal({ idVenda: 1 });

    expect(result.loja).toEqual({ id: 1, nome: 'Loja' });
    expect(result.totalVendas).toBe(300);
    expect(result.cupomItens).toHaveLength(2);
    expect(result.tributosAproximados).toBeGreaterThan(0);
    expect(repository.getCupomItens).toHaveBeenCalledWith(1);
    expect(lojaService.findById).toHaveBeenCalledWith(1);
  });

  it('should generate a fiscal coupon summary with undefined subtotal', async () => {
    lojaService.findById.mockResolvedValue({ id: 1, nome: 'Loja' } as any);
    repository.getCupomItens.mockResolvedValue([
      {
        subTotal: undefined,
        icms: '10',
        pis: '1',
        cofins: '2',
        ipi: '3',
      },
      {
        subtotal: undefined,
        icms: '5',
        pis: '1',
        cofins: '2',
        ipi: '4',
      },
    ] as any);

    const result = await service.generateCupomFiscal({ idVenda: 1 });

    expect(result.loja).toEqual({ id: 1, nome: 'Loja' });
    expect(result.totalVendas).toBe(0);
    expect(result.cupomItens).toHaveLength(2);
    expect(result.tributosAproximados).toBe(0);
    expect(repository.getCupomItens).toHaveBeenCalledWith(1);
    expect(lojaService.findById).toHaveBeenCalledWith(1);
  });
});
