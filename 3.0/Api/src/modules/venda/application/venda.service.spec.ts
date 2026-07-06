import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { JOB_NAMES } from 'src/shared/queue-names';
import { VendaService } from './venda.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let repository: any;
let vendaItemService: any;
let estoqueQueue: any;
let contasReceberQueue: any;
let service: VendaService;

describe('VendaService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      existsByClienteId: jest.fn(),
    };
    vendaItemService = {
      findByIdVenda: jest.fn().mockResolvedValue([]),
    };
    estoqueQueue = { add: jest.fn().mockResolvedValue(undefined) };
    contasReceberQueue = { add: jest.fn().mockResolvedValue(undefined) };
    service = new VendaService(repository, vendaItemService, estoqueQueue, contasReceberQueue);
  });

  it('should create venda and emit contas_receber criar job', async () => {
    const dto = { idCliente: 1 } as any;
    const created = { id: 10, idCliente: 1 } as any;
    repository.create.mockResolvedValue(created);
    await expect(service.create(dto)).resolves.toBe(created);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(contasReceberQueue.add).toHaveBeenCalledWith(JOB_NAMES.CONTAS_RECEBER.CRIAR, {
      idVenda: 10,
      descricao: 'Lançamento de Venda',
      idPagamento: 1,
      idStatusPagamento: 1,
    });
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
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should delete and emit estorno jobs for each item', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    vendaItemService.findByIdVenda.mockResolvedValue([{ id: 10 }, { id: 20 }] as any);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(vendaItemService.findByIdVenda).toHaveBeenCalledWith(1);
    expect(estoqueQueue.add).toHaveBeenCalledWith(JOB_NAMES.ESTOQUE.ESTORNO, { idVendaItem: 10 });
    expect(estoqueQueue.add).toHaveBeenCalledWith(JOB_NAMES.ESTOQUE.ESTORNO, { idVendaItem: 20 });
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should check if cliente is referenced', async () => {
    repository.existsByClienteId.mockResolvedValue(false);
    await expect(service.existsByClienteId(1)).resolves.toBe(false);
    expect(repository.existsByClienteId).toHaveBeenCalledWith(1);
  });

  it('should return future sales base data when fewer than three entries exist', async () => {
    const baseData = [{ mes: '2024-01', valorTotal: 100, quantidadeVendas: 1 }];
    const expected = [{ mes: '2024-01', valorTotal: 100, quantidadeVendas: 1, isPrevisao: false }];
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
    const forecast = [{ mes: '2024-04', valorTotal: 160, quantidadeVendas: 4, isPrevisao: true }];
    repository.findVendasFuturasBase.mockResolvedValue(baseData);
    mockedAxios.post.mockResolvedValue({ data: forecast });

    await expect(service.findVendasFuturas()).resolves.toEqual([
      { mes: '2024-01', valorTotal: 100, quantidadeVendas: 1, isPrevisao: false },
      { mes: '2024-02', valorTotal: 120, quantidadeVendas: 2, isPrevisao: false },
      { mes: '2024-03', valorTotal: 140, quantidadeVendas: 3, isPrevisao: false },
      ...forecast,
    ]);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://my-business-sales-manager-api-py.dlti3g.easypanel.host/forecast',
      {
        vendas: [
          { mes: '2024-01', valorTotal: 100, quantidadeVendas: 1, isPrevisao: false },
          { mes: '2024-02', valorTotal: 120, quantidadeVendas: 2, isPrevisao: false },
          { mes: '2024-03', valorTotal: 140, quantidadeVendas: 3, isPrevisao: false },
        ],
      },
    );
  });
});
