import { tenantEntities } from './shared/entities/tenant-entities';
import { TenantDataSource } from './data-source-tenant';

describe('TenantDataSource', () => {
  it('should be configured with the tenant entities', () => {
    expect(TenantDataSource.options.entities).toBe(tenantEntities);
  });
});
