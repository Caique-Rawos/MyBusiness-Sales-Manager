import { NotFoundException } from '@nestjs/common';
import { ClienteService } from './cliente.service';

let repository: any;
let service: ClienteService;

describe('ClienteService', () => {
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
    service = new ClienteService(repository as any);
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
});
