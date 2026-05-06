import { VendaRelatorioTypeOrmRepository } from './venda_relatorio.repository';

describe('VendaRelatorioTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: VendaRelatorioTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
      getCupomItens: jest.fn(),
    };
    repository = new VendaRelatorioTypeOrmRepository(typeOrmRepository as any);
  });

  it('should find all entities', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAll({} as any)).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });

  it('should retrieve cupom items', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.createQueryBuilder.mockReturnValue({
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(result),
    });
    await expect(repository.getCupomItens(1)).resolves.toBe(result);
    expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('venda');
  });

  it('should find all group by cliente', async () => {
    const result = [{ idCliente: 1 }];
    typeOrmRepository.createQueryBuilder.mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(result),
    });
    await expect(repository.findAllGroupByCliente({} as any)).resolves.toBe(
      result,
    );
    expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('venda');
  });

  it('should find all group by data', async () => {
    const result = [{ data: '2024-01-01' }];
    typeOrmRepository.createQueryBuilder.mockReturnValue({
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(result),
    });
    await expect(repository.findAllGroupByData({} as any)).resolves.toBe(
      result,
    );
    expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('venda');
  });
});
