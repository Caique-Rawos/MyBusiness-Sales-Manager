import { buildTypeOrmOptions } from './typeorm-options';

describe('buildTypeOrmOptions', () => {
  it('should not set schema/extra when no schema is provided', () => {
    const options = buildTypeOrmOptions();
    expect(options).not.toHaveProperty('schema');
    expect(options).not.toHaveProperty('extra');
  });

  it('should set schema and search_path extra option when a schema is provided', () => {
    const options = buildTypeOrmOptions('tenant_1') as any;
    expect(options.schema).toBe('tenant_1');
    expect(options.extra).toEqual({ options: '-c search_path="tenant_1"' });
  });
});
