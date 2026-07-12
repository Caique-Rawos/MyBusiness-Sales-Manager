import { Client } from 'pg';

export async function ensureSchemaExists(schema: string): Promise<void> {
  const client = new Client({
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });

  await client.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  } finally {
    await client.end();
  }
}
