import { UsuarioTypeOrmRepository } from './usuario.repository';

describe('UsuarioTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: UsuarioTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    repository = new UsuarioTypeOrmRepository(typeOrmRepository);
  });

  it('should create an entity', async () => {
    const entity = { id: 1 };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create({} as any)).resolves.toBe(entity);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should find entity by id', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findById(1)).resolves.toBe(result);
  });

  describe('findByEmailComPermissoes', () => {
    it('should flatten unique permission keys from papeis/permissoes', async () => {
      typeOrmRepository.findOne.mockResolvedValue({
        id: 1,
        papeis: [
          { permissoes: [{ chave: 'venda:listar' }, { chave: 'venda:criar' }] },
          { permissoes: [{ chave: 'venda:listar' }] },
        ],
      });

      const result = await repository.findByEmailComPermissoes('a@a.com');

      expect(result?.permissions).toEqual(['venda:listar', 'venda:criar']);
    });

    it('should return null when usuario is not found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);
      await expect(repository.findByEmailComPermissoes('a@a.com')).resolves.toBeNull();
    });
  });

  it('should find usuario by id with permissoes', async () => {
    typeOrmRepository.findOne.mockResolvedValue({ id: 1, papeis: [] });
    const result = await repository.findByIdComPermissoes(1);
    expect(result?.permissions).toEqual([]);
  });

  it('should map papeis to {id, nome} when listing by tenant', async () => {
    typeOrmRepository.find.mockResolvedValue([
      { id: 1, papeis: [{ id: 1, nome: 'Admin', extra: 'x' }] },
    ]);
    const result = await repository.findAllByTenantId(10);
    expect(result).toEqual([{ id: 1, papeis: [{ id: 1, nome: 'Admin' }] }]);
  });

  it('should find entity by id and tenant', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findByIdAndTenantId(1, 10)).resolves.toBe(result);
  });

  describe('findByIdComPapeis', () => {
    it('should map papeis when usuario is found', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ id: 1, papeis: [{ id: 2, nome: 'Admin' }] });
      await expect(repository.findByIdComPapeis(1)).resolves.toEqual({
        id: 1,
        papeis: [{ id: 2, nome: 'Admin' }],
      });
    });

    it('should return null when usuario is not found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);
      await expect(repository.findByIdComPapeis(1)).resolves.toBeNull();
    });
  });

  it('should attach a papel via relation query builder', async () => {
    const add = jest.fn().mockResolvedValue(undefined);
    const of = jest.fn().mockReturnValue({ add });
    const relation = jest.fn().mockReturnValue({ of });
    typeOrmRepository.createQueryBuilder.mockReturnValue({ relation });

    await repository.attachPapel(1, 2);

    expect(relation).toHaveBeenCalledWith(expect.anything(), 'papeis');
    expect(of).toHaveBeenCalledWith(1);
    expect(add).toHaveBeenCalledWith(2);
  });

  describe('setPapeis', () => {
    function mockRelationChain() {
      const add = jest.fn().mockResolvedValue(undefined);
      const remove = jest.fn().mockResolvedValue(undefined);
      const of = jest.fn().mockReturnValue({ add, remove });
      const relation = jest.fn().mockReturnValue({ of });
      typeOrmRepository.createQueryBuilder.mockReturnValue({ relation });
      return { add, remove };
    }

    it('should add and remove diffed papeis', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ papeis: [{ id: 1 }, { id: 2 }] });
      const { add, remove } = mockRelationChain();

      await repository.setPapeis(1, [2, 3]);

      expect(add).toHaveBeenCalledWith([3]);
      expect(remove).toHaveBeenCalledWith([1]);
    });

    it('should not call add/remove when nothing changed', async () => {
      typeOrmRepository.findOne.mockResolvedValue({ papeis: [{ id: 1 }] });
      const { add, remove } = mockRelationChain();

      await repository.setPapeis(1, [1]);

      expect(add).not.toHaveBeenCalled();
      expect(remove).not.toHaveBeenCalled();
    });

    it('should treat missing usuario as having no current papeis', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);
      const { add, remove } = mockRelationChain();

      await repository.setPapeis(1, [5]);

      expect(add).toHaveBeenCalledWith([5]);
      expect(remove).not.toHaveBeenCalled();
    });
  });

  describe('existsByPapelId', () => {
    it('should return true when count is greater than zero', async () => {
      const queryBuilder = { innerJoin: jest.fn().mockReturnThis(), getCount: jest.fn().mockResolvedValue(2) };
      typeOrmRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      await expect(repository.existsByPapelId(1)).resolves.toBe(true);
    });

    it('should return false when count is zero', async () => {
      const queryBuilder = { innerJoin: jest.fn().mockReturnThis(), getCount: jest.fn().mockResolvedValue(0) };
      typeOrmRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      await expect(repository.existsByPapelId(1)).resolves.toBe(false);
    });
  });

  it('should clear papeis and delete the usuario', async () => {
    typeOrmRepository.findOne.mockResolvedValue(null);
    const of = jest.fn().mockReturnValue({ add: jest.fn(), remove: jest.fn() });
    typeOrmRepository.createQueryBuilder.mockReturnValue({ relation: jest.fn().mockReturnValue({ of }) });
    typeOrmRepository.delete.mockResolvedValue(undefined);

    await repository.delete(1);

    expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
  });
});
