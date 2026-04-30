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
    repository = new ClienteTypeOrmRepository(typeOrmRepository as any);
  });

  it('should create an entity', async () => {
    await expect(repository.create()).resolves.toBeUndefined();
  });

  it('should update an entity', async () => {
    typeOrmRepository.update.mockResolvedValue(undefined);
    await expect(repository.update({ id: 1 } as any)).resolves.toBeUndefined();
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { id: 1 } as any);
  });
});
