import { TenantContextService, TENANT_CLS_KEY } from './tenant-context.service';
import { DEFAULT_TENANT_STORE } from './tenant-store';

describe('TenantContextService', () => {
  let cls: any;
  let registry: any;
  let service: TenantContextService;

  beforeEach(() => {
    cls = { set: jest.fn(), get: jest.fn(), runWith: jest.fn() };
    registry = { getDataSource: jest.fn() };
    service = new TenantContextService(cls, registry);
  });

  it('should store the tenant in the CLS context', () => {
    const store = { schema: 'tenant_1', tenantId: 1, permissions: ['venda:listar'] };
    service.setTenant(store);
    expect(cls.set).toHaveBeenCalledWith(TENANT_CLS_KEY, store);
  });

  it('should return the tenant stored in CLS', () => {
    const store = { schema: 'tenant_1', tenantId: 1 };
    cls.get.mockReturnValue(store);
    expect(service.getTenant()).toBe(store);
  });

  it('should fall back to DEFAULT_TENANT_STORE when CLS has no tenant', () => {
    cls.get.mockReturnValue(undefined);
    expect(service.getTenant()).toBe(DEFAULT_TENANT_STORE);
  });

  it('should get a repository from the DataSource registered for the current tenant schema', () => {
    cls.get.mockReturnValue({ schema: 'tenant_3', tenantId: 3 });
    const repository = { find: jest.fn() };
    const dataSource = { getRepository: jest.fn().mockReturnValue(repository) };
    registry.getDataSource.mockReturnValue(dataSource);

    const entity = class Entity {};
    const result = service.getRepository(entity);

    expect(registry.getDataSource).toHaveBeenCalledWith('tenant_3');
    expect(dataSource.getRepository).toHaveBeenCalledWith(entity);
    expect(result).toBe(repository);
  });

  it('should run a function within a fresh CLS context via runWithTenant', async () => {
    const store = { schema: 'tenant_5', tenantId: 5 };
    const fn = jest.fn().mockResolvedValue('done');
    cls.runWith.mockImplementation((_ctx: unknown, callback: () => Promise<unknown>) => callback());

    await expect(service.runWithTenant(store, fn)).resolves.toBe('done');
    expect(cls.runWith).toHaveBeenCalledWith({ [TENANT_CLS_KEY]: store }, fn);
  });
});
