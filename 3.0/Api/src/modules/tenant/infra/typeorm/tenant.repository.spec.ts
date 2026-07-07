import { TenantTypeOrmRepository } from './tenant.repository';

describe('TenantTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: TenantTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = { create: jest.fn(), save: jest.fn(), update: jest.fn(), findOne: jest.fn(), find: jest.fn() };
    repository = new TenantTypeOrmRepository(typeOrmRepository);
  });

  it('should create and save a tenant', async () => {
    const entity = { id: 1 };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create({ schemaName: 'pending' })).resolves.toBe(entity);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should update and return the tenant', async () => {
    const result = { id: 1, schemaName: 'tenant_1' };
    typeOrmRepository.update.mockResolvedValue(undefined);
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.update(1, { schemaName: 'tenant_1' })).resolves.toBe(result);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { schemaName: 'tenant_1' });
  });

  it('should find tenant by id', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findById(1)).resolves.toBe(result);
  });

  it('should find all active tenants', async () => {
    const expected = [{ id: 1, ativo: true }];
    typeOrmRepository.find.mockResolvedValue(expected);
    await expect(repository.findAllAtivos()).resolves.toBe(expected);
    expect(typeOrmRepository.find).toHaveBeenCalledWith({ where: { ativo: true } });
  });
});
