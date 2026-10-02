import { ConflictException, NotFoundException } from '@nestjs/common';
import { CrachaRfidService } from './cracha_rfid.service';

let repository: any;
let service: CrachaRfidService;

describe('CrachaRfidService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByHash: jest.fn(),
    };
    service = new CrachaRfidService(repository as any);
  });

  it('should create when hash does not exist', async () => {
    const dto = { nome: 'Maria', hash: 'abc' } as any;
    const expected = { id: 1, ...dto };
    repository.findByHash.mockResolvedValue(null);
    repository.create.mockResolvedValue(expected);
    await expect(service.create(dto)).resolves.toBe(expected);
    expect(repository.findByHash).toHaveBeenCalledWith('abc');
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException when hash already exists', async () => {
    repository.findByHash.mockResolvedValue({ id: 1, nome: 'Ana', hash: 'abc' });
    await expect(service.create({ nome: 'Bia', hash: 'abc' })).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should find all', async () => {
    const expected = [] as any;
    repository.findAll.mockResolvedValue(expected);
    await expect(service.findAll()).resolves.toBe(expected);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should find by id', async () => {
    const expected = { id: 1 } as any;
    repository.findById.mockResolvedValue(expected);
    await expect(service.findById(1)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when findById returns null', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should find by hash', async () => {
    const expected = { id: 1 } as any;
    repository.findByHash.mockResolvedValue(expected);
    await expect(service.findByHash('abc')).resolves.toBe(expected);
    expect(repository.findByHash).toHaveBeenCalledWith('abc');
  });

  it('should throw NotFoundException when findByHash returns null', async () => {
    repository.findByHash.mockResolvedValue(null);
    await expect(service.findByHash('abc')).rejects.toThrow(NotFoundException);
  });
});
