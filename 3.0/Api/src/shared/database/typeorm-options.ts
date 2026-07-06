import { DataSourceOptions } from 'typeorm';

export function buildTypeOrmOptions(): DataSourceOptions {
  return {
    type: (process.env.TYPEORM_TYPE as 'postgres') || 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  } as DataSourceOptions;
}
