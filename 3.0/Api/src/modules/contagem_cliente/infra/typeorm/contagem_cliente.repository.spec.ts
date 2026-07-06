import { ClienteTypeOrmRepository } from './contagem_cliente.repository';

describe('ClienteTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: ClienteTypeOrmRepository;

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
    repository = new ClienteTypeOrmRepository(tenantContext);
  });

  it('should create an entity', async () => {
    await expect(repository.create()).resolves.toBeUndefined();
  });

  it('should update an entity', async () => {
    typeOrmRepository.update.mockResolvedValue(undefined);
    await expect(repository.update({ id: 1 } as any)).resolves.toBeUndefined();
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { id: 1 } as any);
  });

  it('should findToday entity', async () => {
    const data = { id: 1, contagem: 2, data: new Date() };
    typeOrmRepository.findOne.mockResolvedValue(data);
    await expect(repository.findToday()).resolves.toEqual(data);
  });
});
