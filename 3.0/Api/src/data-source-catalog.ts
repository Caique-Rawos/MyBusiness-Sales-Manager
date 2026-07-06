import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './shared/database/typeorm-options';
import { catalogEntities } from './shared/entities/catalog-entities';

export const CatalogDataSource = new DataSource({
  ...buildTypeOrmOptions(),
  entities: catalogEntities,
  migrations: ['src/migrations/catalog/*{.ts,.js}'],
});
