import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './shared/database/typeorm-options';
import { tenantEntities } from './shared/entities/tenant-entities';

/**
 * DataSource usado apenas para GERAR/rodar migrations de tenant via CLI.
 * Aponta para o schema "public" como referencia (schema default de um tenant
 * novo antes de ser renomeado) -- em runtime, TenantConnectionRegistryService
 * cria um DataSource equivalente por schema, apontando `schema` dinamicamente.
 */
export const TenantDataSource = new DataSource({
  ...buildTypeOrmOptions(),
  entities: tenantEntities,
  migrations: ['src/migrations/tenant/*{.ts,.js}'],
});
