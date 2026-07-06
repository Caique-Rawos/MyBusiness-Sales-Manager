import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegraFiscalService } from './regra_fiscal.service';

let repository: any;
let produtoService: any;
let service: RegraFiscalService;

describe('RegraFiscalService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    produtoService = {
      existsByRegraFiscalId: jest.fn().mockResolvedValue(false),
    };
    service = new RegraFiscalService(repository as any, produtoService);
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
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should delete when regra fiscal has no produtos', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    produtoService.existsByRegraFiscalId.mockResolvedValue(false);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw ConflictException when regra fiscal has produtos vinculados', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    produtoService.existsByRegraFiscalId.mockResolvedValue(true);
    await expect(service.delete(1)).rejects.toThrow(ConflictException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });
});
