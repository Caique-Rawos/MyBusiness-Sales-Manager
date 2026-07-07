import { RefreshTokenTypeOrmRepository } from './refresh-token.repository';

describe('RefreshTokenTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: RefreshTokenTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), update: jest.fn() };
    repository = new RefreshTokenTypeOrmRepository(typeOrmRepository);
  });

  it('should create and save a refresh token', async () => {
    const entity = { id: 1 };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create({} as any)).resolves.toBe(entity);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should find a refresh token by hash', async () => {
    const result = { id: 1, tokenHash: 'hash' };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findByTokenHash('hash')).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { tokenHash: 'hash' } });
  });

  it('should mark a refresh token as revoked', async () => {
    typeOrmRepository.update.mockResolvedValue(undefined);
    await repository.revogar(1);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, { revogadoEm: expect.any(Date) });
  });
});
