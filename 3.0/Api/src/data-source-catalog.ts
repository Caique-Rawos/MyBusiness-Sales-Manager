import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions, CATALOG_SCHEMA } from './shared/database/typeorm-options';
import { catalogEntities } from './shared/entities/catalog-entities';

export const CatalogDataSource = new DataSource({
  ...buildTypeOrmOptions(CATALOG_SCHEMA),
  entities: catalogEntities,
  migrations: ['src/migrations/catalog/*{.ts,.js}'],
});
