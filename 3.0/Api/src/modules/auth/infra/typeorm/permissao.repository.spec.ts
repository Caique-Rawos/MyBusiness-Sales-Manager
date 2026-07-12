import { PermissaoTypeOrmRepository } from './permissao.repository';

describe('PermissaoTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: PermissaoTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = { find: jest.fn(), upsert: jest.fn() };
    repository = new PermissaoTypeOrmRepository(typeOrmRepository);
  });

  it('should find all permissoes', async () => {
    const expected = [{ id: 1, chave: 'venda:listar' }];
    typeOrmRepository.find.mockResolvedValue(expected);
    await expect(repository.findAll()).resolves.toBe(expected);
  });

  it('should upsert the seed data by chave', async () => {
    typeOrmRepository.upsert.mockResolvedValue(undefined);
    const data = [{ chave: 'venda:listar', descricao: 'Listar - Venda' }];
    await repository.upsertMany(data);
    expect(typeOrmRepository.upsert).toHaveBeenCalledWith(data, ['chave']);
  });
});
