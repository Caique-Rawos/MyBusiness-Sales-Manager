import { catalogEntities } from './shared/entities/catalog-entities';
import { CATALOG_SCHEMA } from './shared/database/typeorm-options';
import { CatalogDataSource } from './data-source-catalog';

describe('CatalogDataSource', () => {
  it('should be configured with the catalog schema and entities', () => {
    expect(CatalogDataSource.options.entities).toBe(catalogEntities);
    expect((CatalogDataSource.options as any).schema).toBe(CATALOG_SCHEMA);
  });
});
