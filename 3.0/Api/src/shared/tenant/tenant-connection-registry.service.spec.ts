import { DataSource } from 'typeorm';
import { TenantConnectionRegistryService } from './tenant-connection-registry.service';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return { ...actual, DataSource: jest.fn() };
});

function mockDataSourceInstance(overrides: Partial<Record<'initialize' | 'runMigrations' | 'destroy', jest.Mock>> = {}) {
  return {
    initialize: overrides.initialize ?? jest.fn().mockResolvedValue(undefined),
    runMigrations: overrides.runMigrations ?? jest.fn().mockResolvedValue(undefined),
    destroy: overrides.destroy ?? jest.fn().mockResolvedValue(undefined),
  };
}

describe('TenantConnectionRegistryService', () => {
  let service: TenantConnectionRegistryService;

  beforeEach(() => {
    jest.clearAllMocks();
    (DataSource as unknown as jest.Mock).mockImplementation(() => mockDataSourceInstance());
    service = new TenantConnectionRegistryService();
  });

  it('should create and initialize a DataSource for a new schema', async () => {
    const dataSource = await service.ensureDataSource('tenant_1');

    expect(DataSource).toHaveBeenCalledTimes(1);
    const options = (DataSource as unknown as jest.Mock).mock.calls[0][0];
    expect(options.schema).toBe('tenant_1');
    expect(options.extra.options).toBe('-c search_path="tenant_1"');
    expect(dataSource.initialize).toHaveBeenCalled();
    expect(dataSource.runMigrations).toHaveBeenCalled();
  });

  it('should return the cached DataSource on subsequent calls for the same schema', async () => {
    const first = await service.ensureDataSource('tenant_1');
    const second = await service.ensureDataSource('tenant_1');

    expect(DataSource).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  it('should share the in-flight creation promise between concurrent calls', async () => {
    let resolveInit!: () => void;
    const initPromise = new Promise<void>((resolve) => {
      resolveInit = resolve;
    });
    (DataSource as unknown as jest.Mock).mockImplementation(() =>
      mockDataSourceInstance({ initialize: jest.fn().mockReturnValue(initPromise) }),
    );

    const p1 = service.ensureDataSource('tenant_9');
    const p2 = service.ensureDataSource('tenant_9');
    resolveInit();
    const [ds1, ds2] = await Promise.all([p1, p2]);

    expect(DataSource).toHaveBeenCalledTimes(1);
    expect(ds1).toBe(ds2);
  });

  it('should throw when getDataSource is called before ensureDataSource', () => {
    expect(() => service.getDataSource('tenant_404')).toThrow(
      'Nenhum DataSource inicializado para o schema "tenant_404". Chame ensureDataSource() antes de usar o contexto de tenant.',
    );
  });

  it('should return the initialized DataSource via getDataSource', async () => {
    const dataSource = await service.ensureDataSource('tenant_1');
    expect(service.getDataSource('tenant_1')).toBe(dataSource);
  });

  it('should destroy every cached DataSource on module destroy', async () => {
    const ds1 = await service.ensureDataSource('tenant_1');
    const ds2 = await service.ensureDataSource('tenant_2');

    await service.onModuleDestroy();

    expect(ds1.destroy).toHaveBeenCalled();
    expect(ds2.destroy).toHaveBeenCalled();
  });
});
