describe('ensure-catalog-schema (script)', () => {
  let exitSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should exit with code 0 when the schema is ensured successfully', async () => {
    jest.isolateModules(() => {
      jest.doMock('./ensure-schema', () => ({ ensureSchemaExists: jest.fn().mockResolvedValue(undefined) }));
      require('./ensure-catalog-schema');
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should log the error and exit with code 1 when ensuring the schema fails', async () => {
    const error = new Error('conexao recusada');
    jest.isolateModules(() => {
      jest.doMock('./ensure-schema', () => ({ ensureSchemaExists: jest.fn().mockRejectedValue(error) }));
      require('./ensure-catalog-schema');
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
