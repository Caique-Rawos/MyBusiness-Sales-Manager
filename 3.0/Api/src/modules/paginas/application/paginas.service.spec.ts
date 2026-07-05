import { NotFoundException } from '@nestjs/common';
import { PaginasService } from './paginas.service';

let repository: any;
let service: PaginasService;

describe('PaginasService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByAlias: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new PaginasService(repository as any);
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

  it('should update when entity exists', async () => {
    const expected = {} as any;
    repository.findByAlias.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue(expected);
    await expect(service.update('alias', {} as any)).resolves.toBe(expected);
    expect(repository.findByAlias).toHaveBeenCalledWith('alias');
    expect(repository.update).toHaveBeenCalledWith(1, {});
  });

  it('should throw NotFoundException when update entity does not exist', async () => {
    repository.findByAlias.mockResolvedValue(null);
    await expect(service.update('alias', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete when entity exists', async () => {
    repository.findByAlias.mockResolvedValue({ id: 1 } as any);
    await expect(service.delete('alias')).resolves.toBeUndefined();
    expect(repository.findByAlias).toHaveBeenCalledWith('alias');
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findByAlias.mockResolvedValue(null);
    await expect(service.delete('alias')).rejects.toThrow(NotFoundException);
  });

  it('should find by alias', async () => {
    const expected = {} as any;
    repository.findByAlias.mockResolvedValue(expected);
    await expect(service.findByAlias('alias')).resolves.toBe(expected);
    expect(repository.findByAlias).toHaveBeenCalledWith('alias');
  });

  it('should throw NotFoundException when alias not found', async () => {
    repository.findByAlias.mockResolvedValue(null);
    await expect(service.findByAlias('alias')).rejects.toThrow(
      NotFoundException,
    );
  });
});
