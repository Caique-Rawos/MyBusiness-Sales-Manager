import { Client } from 'pg';
import { ensureSchemaExists } from './ensure-schema';

jest.mock('pg', () => ({ Client: jest.fn() }));

describe('ensureSchemaExists', () => {
  it('should connect, create the schema if missing and close the connection', async () => {
    const query = jest.fn().mockResolvedValue(undefined);
    const connect = jest.fn().mockResolvedValue(undefined);
    const end = jest.fn().mockResolvedValue(undefined);
    (Client as unknown as jest.Mock).mockImplementation(() => ({ connect, query, end }));

    await ensureSchemaExists('catalog');

    expect(connect).toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "catalog"');
    expect(end).toHaveBeenCalled();
  });

  it('should close the connection even when the query fails', async () => {
    const connect = jest.fn().mockResolvedValue(undefined);
    const query = jest.fn().mockRejectedValue(new Error('boom'));
    const end = jest.fn().mockResolvedValue(undefined);
    (Client as unknown as jest.Mock).mockImplementation(() => ({ connect, query, end }));

    await expect(ensureSchemaExists('catalog')).rejects.toThrow('boom');
    expect(end).toHaveBeenCalled();
  });
});
