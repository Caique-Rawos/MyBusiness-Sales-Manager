import { ProdutoTypeOrmRepository } from './produto.repository';

describe('ProdutoTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: ProdutoTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      getCupomItens: jest.fn(),
    };
    const tenantContext: any = { getRepository: jest.fn().mockReturnValue(typeOrmRepository) };
    repository = new ProdutoTypeOrmRepository(tenantContext);
  });

  it('should create an entity', async () => {
    const entity = { id: 1 };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create({} as any)).resolves.toBe(entity);
    expect(typeOrmRepository.create).toHaveBeenCalledWith({} as any);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should find all entities', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAll()).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });

  it('should find entity by id', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findById(1)).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalled();
  });

  it('should update an entity', async () => {
    const result = { id: 1 };
    typeOrmRepository.update.mockResolvedValue(undefined);
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.update(1, {} as any)).resolves.toBe(result);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, {});
    expect(typeOrmRepository.findOne).toHaveBeenCalled();
  });

  it('should delete an entity', async () => {
    typeOrmRepository.delete.mockResolvedValue(undefined);
    await expect(repository.delete(1)).resolves.toBeUndefined();
    expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should check if regra fiscal is referenced', async () => {
    typeOrmRepository.count.mockResolvedValue(1);
    await expect(repository.existsByRegraFiscalId(1)).resolves.toBe(true);
    expect(typeOrmRepository.count).toHaveBeenCalledWith({ where: { idRegraFiscal: 1 } });
  });

  it('should check if categoria is referenced', async () => {
    typeOrmRepository.count.mockResolvedValue(0);
    await expect(repository.existsByCategoriaId(1)).resolves.toBe(false);
    expect(typeOrmRepository.count).toHaveBeenCalledWith({ where: { idCategoria: 1 } });
  });

  it('should update estoque', async () => {
    typeOrmRepository.update.mockResolvedValue(undefined);
    await repository.updateEstoque(1, 42);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { estoque: 42 });
  });
});
