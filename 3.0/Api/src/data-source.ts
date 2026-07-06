import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './shared/database/typeorm-options';
import { catalogEntities } from './shared/entities/catalog-entities';
import { tenantEntities } from './shared/entities/tenant-entities';

export const AppDataSource = new DataSource({
  ...buildTypeOrmOptions(),
  entities: [...catalogEntities, ...tenantEntities],
  migrations: ['src/migrations/*{.ts,.js}'],
});
