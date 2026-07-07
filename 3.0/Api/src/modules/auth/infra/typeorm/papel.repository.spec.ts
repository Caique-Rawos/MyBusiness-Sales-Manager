import { NotFoundException } from '@nestjs/common';
import { PapelTypeOrmRepository } from './papel.repository';

describe('PapelTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: PapelTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    repository = new PapelTypeOrmRepository(typeOrmRepository);
  });

  it('should create a papel mapping permissaoIds to relation stubs', async () => {
    typeOrmRepository.create.mockReturnValue({ nome: 'Admin', tenantId: 10, permissoes: [{ id: 1 }] });
    typeOrmRepository.save.mockResolvedValue({ id: 1, nome: 'Admin', tenantId: 10 });

    const result = await repository.create({ nome: 'Admin', tenantId: 10, permissaoIds: [1] });

    expect(typeOrmRepository.create).toHaveBeenCalledWith({
      nome: 'Admin',
      tenantId: 10,
      permissoes: [{ id: 1 }],
    });
    expect(result).toEqual({ id: 1, nome: 'Admin', tenantId: 10 });
  });

  it('should list papeis by tenant mapping permissoes', async () => {
    typeOrmRepository.find.mockResolvedValue([
      { id: 1, nome: 'Admin', tenantId: 10, permissoes: [{ id: 1, chave: 'venda:listar', descricao: 'x' }] },
    ]);

    const result = await repository.findAllByTenantId(10);

    expect(result).toEqual([
      { id: 1, nome: 'Admin', tenantId: 10, permissoes: [{ id: 1, chave: 'venda:listar', descricao: 'x' }] },
    ]);
  });

  describe('findByIdAndTenantId', () => {
    it('should map permissoes when papel is found', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ id: 1, nome: 'Admin', tenantId: 10, permissoes: [] });
      await expect(repository.findByIdAndTenantId(1, 10)).resolves.toEqual({
        id: 1,
        nome: 'Admin',
        tenantId: 10,
        permissoes: [],
      });
    });

    it('should return null when papel is not found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);
      await expect(repository.findByIdAndTenantId(1, 10)).resolves.toBeNull();
    });
  });

  describe('update', () => {
    function mockRelationChain() {
      const add = jest.fn().mockResolvedValue(undefined);
      const remove = jest.fn().mockResolvedValue(undefined);
      const of = jest.fn().mockReturnValue({ add, remove });
      const relation = jest.fn().mockReturnValue({ of });
      typeOrmRepository.createQueryBuilder.mockReturnValue({ relation });
      return { add, remove };
    }

    it('should update only nome when permissaoIds is not provided', async () => {
      typeOrmRepository.update.mockResolvedValue(undefined);
      typeOrmRepository.findOne.mockResolvedValue({ id: 1, nome: 'Novo nome', tenantId: 10 });

      const result = await repository.update(1, { nome: 'Novo nome' });

      expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { nome: 'Novo nome' });
      expect(typeOrmRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, nome: 'Novo nome', tenantId: 10 });
    });

    it('should diff and update permissoes when permissaoIds is provided', async () => {
      typeOrmRepository.findOne
        .mockResolvedValueOnce({ permissoes: [{ id: 1 }, { id: 2 }] })
        .mockResolvedValueOnce({ id: 1, nome: 'Admin', tenantId: 10 });
      const { add, remove } = mockRelationChain();

      const result = await repository.update(1, { permissaoIds: [2, 3] });

      expect(add).toHaveBeenCalledWith([3]);
      expect(remove).toHaveBeenCalledWith([1]);
      expect(result).toEqual({ id: 1, nome: 'Admin', tenantId: 10 });
    });

    it('should not touch relation when permissaoIds diff is empty', async () => {
      typeOrmRepository.findOne
        .mockResolvedValueOnce({ permissoes: [{ id: 1 }] })
        .mockResolvedValueOnce({ id: 1, nome: 'Admin', tenantId: 10 });
      const { add, remove } = mockRelationChain();

      await repository.update(1, { permissaoIds: [1] });

      expect(add).not.toHaveBeenCalled();
      expect(remove).not.toHaveBeenCalled();
    });

    it('should treat missing papel as having no current permissoes', async () => {
      typeOrmRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1, nome: 'Admin', tenantId: 10 });
      const { add, remove } = mockRelationChain();

      await repository.update(1, { permissaoIds: [1] });

      expect(add).toHaveBeenCalledWith([1]);
      expect(remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when papel no longer exists after update', async () => {
      typeOrmRepository.update.mockResolvedValue(undefined);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update(1, { nome: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should remove all permissoes before deleting when papel has permissoes', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ permissoes: [{ id: 1 }, { id: 2 }] });
      const remove = jest.fn().mockResolvedValue(undefined);
      const of = jest.fn().mockReturnValue({ remove });
      const relation = jest.fn().mockReturnValue({ of });
      typeOrmRepository.createQueryBuilder.mockReturnValue({ relation });
      typeOrmRepository.delete.mockResolvedValue(undefined);

      await repository.delete(1);

      expect(remove).toHaveBeenCalledWith([1, 2]);
      expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete directly when papel has no permissoes', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ permissoes: [] });
      typeOrmRepository.delete.mockResolvedValue(undefined);

      await repository.delete(1);

      expect(typeOrmRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should treat missing papel as having no permissoes to remove', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);
      typeOrmRepository.delete.mockResolvedValue(undefined);

      await repository.delete(1);

      expect(typeOrmRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
