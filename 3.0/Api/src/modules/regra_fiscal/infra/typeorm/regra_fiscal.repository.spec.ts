import { RegraFiscalTypeOrmRepository } from './regra_fiscal.repository';

describe('RegraFiscalTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: RegraFiscalTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getCupomItens: jest.fn(),
    };
    const tenantContext: any = { getRepository: jest.fn().mockReturnValue(typeOrmRepository) };
    repository = new RegraFiscalTypeOrmRepository(tenantContext);
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
});
