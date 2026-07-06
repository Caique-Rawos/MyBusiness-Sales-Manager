import { NotFoundException } from '@nestjs/common';
import { JOB_NAMES } from 'src/shared/queue-names';
import { VendaItemService } from './venda_item.service';

let repository: any;
let vendaQueue: any;
let estoqueQueue: any;
let tenantContext: any;
let service: VendaItemService;

describe('VendaItemService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      existsByProdutoId: jest.fn(),
    };
    vendaQueue = { add: jest.fn().mockResolvedValue(undefined) };
    estoqueQueue = { add: jest.fn().mockResolvedValue(undefined) };
    tenantContext = { getTenant: jest.fn().mockReturnValue({ schema: 'public', tenantId: 0 }) };
    service = new VendaItemService(repository, vendaQueue, estoqueQueue, tenantContext);
  });

  it('should create and emit queue jobs', async () => {
    const dto = { idVenda: 1, idProduto: 2, quantidade: 3 } as any;
    const expected = { id: 10, idVenda: 1 } as any;
    repository.create.mockResolvedValue(expected);
    await expect(service.create(dto)).resolves.toBe(expected);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(vendaQueue.add).toHaveBeenCalledWith(JOB_NAMES.VENDA.CALCULAR_TOTAL, {
      idVenda: 1,
      schema: 'public',
      tenantId: 0,
    });
    expect(estoqueQueue.add).toHaveBeenCalledWith(JOB_NAMES.ESTOQUE.SAIDA, {
      idProduto: 2,
      quantidade: 3,
      idVenda: 1,
      idVendaItem: 10,
      schema: 'public',
      tenantId: 0,
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

  it('should delete and emit estorno + calcular-total jobs', async () => {
    repository.findById.mockResolvedValue({ id: 1, idVenda: 5 } as any);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(estoqueQueue.add).toHaveBeenCalledWith(JOB_NAMES.ESTOQUE.ESTORNO, {
      idVendaItem: 1,
      schema: 'public',
      tenantId: 0,
    });
    expect(vendaQueue.add).toHaveBeenCalledWith(JOB_NAMES.VENDA.CALCULAR_TOTAL, {
      idVenda: 5,
      schema: 'public',
      tenantId: 0,
    });
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should find by venda id', async () => {
    const expected = [] as any;
    repository.findByVendaId.mockResolvedValue(expected);
    await expect(service.findByIdVenda(1)).resolves.toBe(expected);
    expect(repository.findByVendaId).toHaveBeenCalledWith(1);
  });

  it('should check if produto is referenced', async () => {
    repository.existsByProdutoId.mockResolvedValue(true);
    await expect(service.existsByProdutoId(1)).resolves.toBe(true);
    expect(repository.existsByProdutoId).toHaveBeenCalledWith(1);
  });
});
