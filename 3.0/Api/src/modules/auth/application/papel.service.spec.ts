import { ConflictException, NotFoundException } from '@nestjs/common';
import { PapelService } from './papel.service';

describe('PapelService', () => {
  let repository: any;
  let usuarioService: any;
  let service: PapelService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAllByTenantId: jest.fn(),
      findByIdAndTenantId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    usuarioService = { existsByPapelId: jest.fn() };
    service = new PapelService(repository, usuarioService);
  });

  it('should create a papel for the tenant', async () => {
    const dto = { nome: 'Admin', permissaoIds: [1, 2] } as any;
    const created = { id: 1, nome: 'Admin', tenantId: 10 };
    repository.create.mockResolvedValue(created);

    await expect(service.create(dto, 10)).resolves.toBe(created);
    expect(repository.create).toHaveBeenCalledWith({ nome: 'Admin', tenantId: 10, permissaoIds: [1, 2] });
  });

  it('should list papeis by tenant', async () => {
    const expected = [{ id: 1 }] as any;
    repository.findAllByTenantId.mockResolvedValue(expected);
    await expect(service.findAllByTenant(10)).resolves.toBe(expected);
    expect(repository.findAllByTenantId).toHaveBeenCalledWith(10);
  });

  describe('update', () => {
    it('should throw NotFoundException when papel does not belong to tenant', async () => {
      repository.findByIdAndTenantId.mockResolvedValue(null);
      await expect(service.update(1, 10, {} as any)).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update the papel when it exists in tenant', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1 });
      const updated = { id: 1, nome: 'Novo nome' };
      repository.update.mockResolvedValue(updated);
      const dto = { nome: 'Novo nome' } as any;

      await expect(service.update(1, 10, dto)).resolves.toBe(updated);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when papel does not belong to tenant', async () => {
      repository.findByIdAndTenantId.mockResolvedValue(null);
      await expect(service.remove(1, 10)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when papel is assigned to a usuario', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1 });
      usuarioService.existsByPapelId.mockResolvedValue(true);
      await expect(service.remove(1, 10)).rejects.toThrow(ConflictException);
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should delete the papel when it is not assigned to any usuario', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1 });
      usuarioService.existsByPapelId.mockResolvedValue(false);
      await service.remove(1, 10);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
