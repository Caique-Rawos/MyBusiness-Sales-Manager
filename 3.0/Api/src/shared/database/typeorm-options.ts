import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const CATALOG_SCHEMA = process.env.TYPEORM_CATALOG_SCHEMA || 'catalog';

export function buildTypeOrmOptions(
  schema?: string,
): Omit<PostgresConnectionOptions, 'entities' | 'migrations'> {
  return {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    // mesmo gotcha do TenantConnectionRegistryService: SQL cru de migration ignora `schema`, só o search_path
    ...(schema ? { schema, extra: { options: `-c search_path="${schema}"` } } : {}),
  };
}
