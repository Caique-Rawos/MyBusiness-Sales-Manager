import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function buildTypeOrmOptions(): Omit<PostgresConnectionOptions, 'entities' | 'migrations'> {
  return {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  };
}
