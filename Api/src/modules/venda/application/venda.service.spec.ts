import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { VendaService } from './venda.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let repository: any;
let contasReceberService: any;
let service: VendaService;

describe('VendaService', () => {
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
    contasReceberService = {
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
    service = new VendaService(repository, contasReceberService as any);
  });

  it('should create', async () => {
    const dto = {} as any;
    const expected = {} as any;
    repository.create.mockResolvedValue(expected);
    await expect(service.create(dto)).resolves.toBe(expected);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should find all', async () => {
    const expected = [] as any;
    repository.findAll.mockResolvedValue(expected);
    await expect(service.findAll()).resolves.toBe(expected);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should find by id', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue(expected);
    await expect(service.findById(1)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when findById returns null', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update when entity exists', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue(expected);
    await expect(service.update(1, {} as any)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalledWith(1, {});
  });

  it('should throw NotFoundException when update entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete when entity exists', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should return future sales base data when fewer than three entries exist', async () => {
    const baseData = [{ mes: '2024-01', valorTotal: 100, quantidadeVendas: 1 }];
    const expected = [
      {
        mes: '2024-01',
        valorTotal: 100,
        quantidadeVendas: 1,
        isPrevisao: false,
      },
    ];
    repository.findVendasFuturasBase.mockResolvedValue(baseData);
    await expect(service.findVendasFuturas()).resolves.toEqual(expected);
    expect(repository.findVendasFuturasBase).toHaveBeenCalled();
  });

  it('should include forecast data when more than two months exist', async () => {
    const baseData = [
      { mes: '2024-01', valorTotal: 100, quantidadeVendas: 1 },
      { mes: '2024-02', valorTotal: 120, quantidadeVendas: 2 },
      { mes: '2024-03', valorTotal: 140, quantidadeVendas: 3 },
    ];
    const forecast = [
      {
        mes: '2024-04',
        valorTotal: 160,
        quantidadeVendas: 4,
        isPrevisao: true,
      },
    ];
    repository.findVendasFuturasBase.mockResolvedValue(baseData);
    mockedAxios.post.mockResolvedValue({ data: forecast });

    await expect(service.findVendasFuturas()).resolves.toEqual([
      {
        mes: '2024-01',
        valorTotal: 100,
        quantidadeVendas: 1,
        isPrevisao: false,
      },
      {
        mes: '2024-02',
        valorTotal: 120,
        quantidadeVendas: 2,
        isPrevisao: false,
      },
      {
        mes: '2024-03',
        valorTotal: 140,
        quantidadeVendas: 3,
        isPrevisao: false,
      },
      ...forecast,
    ]);
    expect(repository.findVendasFuturasBase).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://my-business-sales-manager-api-py.dlti3g.easypanel.host/forecast',
      {
        vendas: [
          {
            mes: '2024-01',
            valorTotal: 100,
            quantidadeVendas: 1,
            isPrevisao: false,
          },
          {
            mes: '2024-02',
            valorTotal: 120,
            quantidadeVendas: 2,
            isPrevisao: false,
          },
          {
            mes: '2024-03',
            valorTotal: 140,
            quantidadeVendas: 3,
            isPrevisao: false,
          },
        ],
      },
    );
  });

  it('should update total and call related service', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue({} as any);
    contasReceberService.atualizaTotal.mockResolvedValue(undefined);
    await expect(
      service.atualizaTotal({ id_venda: 1, total: 50 }),
    ).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalledWith(1, { totalVenda: 50 });
    expect(contasReceberService.atualizaTotal).toHaveBeenCalledWith({
      id_venda: 1,
      total: 50,
    });
  });

  it('should throw NotFoundException when venda is not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(
      service.atualizaTotal({ id_venda: 1, total: 50 }),
    ).rejects.toThrow(NotFoundException);
  });
});
