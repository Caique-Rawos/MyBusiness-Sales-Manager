import { VendaTypeOrmRepository } from './venda.repository';

describe('VendaTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: VendaTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getCupomItens: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    repository = new VendaTypeOrmRepository(typeOrmRepository as any);
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

  it('should get future sales base data', async () => {
    const queryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest
        .fn()
        .mockResolvedValue([
          { mes: '01-2024', quantidadeVendas: '1', valorTotal: '100' },
        ]),
    };
    typeOrmRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(repository.findVendasFuturasBase()).resolves.toEqual([
      { mes: '01-2024', quantidadeVendas: '1', valorTotal: '100' },
    ]);
    expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('venda');
    expect(queryBuilder.getRawMany).toHaveBeenCalled();
  });
});
