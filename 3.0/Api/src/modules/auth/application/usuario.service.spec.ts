import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from './usuario.service';

jest.mock('bcrypt');

describe('UsuarioService', () => {
  let repository: any;
  let service: UsuarioService;

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-senha');
    repository = {
      findByEmailComPermissoes: jest.fn(),
      create: jest.fn(),
      setPapeis: jest.fn(),
      findByIdComPapeis: jest.fn(),
      findAllByTenantId: jest.fn(),
      findByIdAndTenantId: jest.fn(),
      delete: jest.fn(),
      existsByPapelId: jest.fn(),
    };
    service = new UsuarioService(repository);
  });

  describe('create', () => {
    it('should throw ConflictException when e-mail is already in use', async () => {
      repository.findByEmailComPermissoes.mockResolvedValue({ id: 1 });
      const dto = { nome: 'A', email: 'a@a.com', senha: 'senha123', papelIds: [] } as any;
      await expect(service.create(dto, 10)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should create usuario without papeis when papelIds is empty', async () => {
      repository.findByEmailComPermissoes.mockResolvedValue(null);
      const created = { id: 2, nome: 'A', email: 'a@a.com' };
      repository.create.mockResolvedValue(created);
      const dto = { nome: 'A', email: 'a@a.com', senha: 'senha123', papelIds: [] } as any;

      const result = await service.create(dto, 10);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(repository.create).toHaveBeenCalledWith({
        nome: 'A',
        email: 'a@a.com',
        senhaHash: 'hashed-senha',
        tenantId: 10,
      });
      expect(repository.setPapeis).not.toHaveBeenCalled();
      expect(result).toEqual({ ...created, papeis: [] });
    });

    it('should attach papeis and return usuario with papeis when papelIds is not empty', async () => {
      repository.findByEmailComPermissoes.mockResolvedValue(null);
      const created = { id: 3, nome: 'B', email: 'b@b.com' };
      repository.create.mockResolvedValue(created);
      const comPapeis = { ...created, papeis: [{ id: 1, nome: 'Admin' }] };
      repository.findByIdComPapeis.mockResolvedValue(comPapeis);
      const dto = { nome: 'B', email: 'b@b.com', senha: 'senha123', papelIds: [1] } as any;

      const result = await service.create(dto, 10);

      expect(repository.setPapeis).toHaveBeenCalledWith(3, [1]);
      expect(result).toBe(comPapeis);
    });
  });

  it('should find all usuarios by tenant', async () => {
    const expected = [{ id: 1 }] as any;
    repository.findAllByTenantId.mockResolvedValue(expected);
    await expect(service.findAllByTenant(10)).resolves.toBe(expected);
    expect(repository.findAllByTenantId).toHaveBeenCalledWith(10);
  });

  describe('updatePapeis', () => {
    it('should throw NotFoundException when usuario does not exist in tenant', async () => {
      repository.findByIdAndTenantId.mockResolvedValue(null);
      await expect(service.updatePapeis(1, 10, [1, 2])).rejects.toThrow(NotFoundException);
      expect(repository.setPapeis).not.toHaveBeenCalled();
    });

    it('should update papeis when usuario exists', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1 });
      await service.updatePapeis(1, 10, [1, 2]);
      expect(repository.setPapeis).toHaveBeenCalledWith(1, [1, 2]);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when usuario does not exist in tenant', async () => {
      repository.findByIdAndTenantId.mockResolvedValue(null);
      await expect(service.remove(1, 10, 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when trying to remove the owner', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1, isOwner: true });
      await expect(service.remove(1, 10, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user tries to remove themselves', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1, isOwner: false });
      await expect(service.remove(1, 10, 1)).rejects.toThrow(BadRequestException);
    });

    it('should delete usuario when none of the invariants are violated', async () => {
      repository.findByIdAndTenantId.mockResolvedValue({ id: 1, isOwner: false });
      await service.remove(1, 10, 2);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  it('should check if papel is referenced by any usuario', async () => {
    repository.existsByPapelId.mockResolvedValue(true);
    await expect(service.existsByPapelId(5)).resolves.toBe(true);
    expect(repository.existsByPapelId).toHaveBeenCalledWith(5);
  });
});
