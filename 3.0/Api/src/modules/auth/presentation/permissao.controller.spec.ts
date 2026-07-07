import { Test, TestingModule } from '@nestjs/testing';
import { PERMISSAO_REPOSITORY } from '../domain/permissao.repository';
import { PermissaoController } from './permissao.controller';

describe('PermissaoController', () => {
  let controller: PermissaoController;
  let permissaoRepository: { findAll: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissaoController],
      providers: [{ provide: PERMISSAO_REPOSITORY, useValue: { findAll: jest.fn() } }],
    }).compile();

    controller = module.get(PermissaoController);
    permissaoRepository = module.get(PERMISSAO_REPOSITORY);
  });

  it('should list all permissoes', async () => {
    const expected = [{ id: 1, chave: 'venda:listar' }];
    permissaoRepository.findAll.mockResolvedValue(expected);
    await expect(controller.findAll()).resolves.toBe(expected);
    expect(permissaoRepository.findAll).toHaveBeenCalled();
  });
});
