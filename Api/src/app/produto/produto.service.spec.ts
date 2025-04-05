import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProdutoEntity } from './entity/produtos.entity';
import { ProdutoService } from './produto.service';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  findOne: jest.fn().mockReturnValue({}),
};

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(ProdutoEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should create a produto entity', async () => {
    const produtoData = {} as unknown as ProdutoEntity;

    const spyCreate = jest
      .spyOn(repositoryMock, 'create')
      .mockReturnValue(produtoData);
    const spySave = jest
      .spyOn(repositoryMock, 'save')
      .mockResolvedValue(produtoData);

    const result = await service.create(produtoData);

    expect(result).toEqual(produtoData);
    expect(spyCreate).toHaveBeenCalledWith(produtoData);
    expect(spySave).toHaveBeenCalledWith(produtoData);
  });

  it('should return a list of produtos', async () => {
    const produtos = [];

    const spyFind = jest
      .spyOn(repositoryMock, 'find')
      .mockResolvedValue(produtos);

    const result = await service.findAll();

    expect(result).toEqual(produtos);
    expect(spyFind).toHaveBeenCalled();
  });

  describe('atualizaEstoque', () => {
    it('should update the stock of the product', async () => {
      const idProduto = 1;
      const quantidade = 5;

      const produtoMock = {
        id: idProduto,
        estoque: 10,
      };

      jest
        .spyOn(repositoryMock, 'findOne')
        .mockResolvedValue(produtoMock as ProdutoEntity);

      const saveSpy = jest
        .spyOn(repositoryMock, 'save')
        .mockResolvedValue(produtoMock as ProdutoEntity);

      await service.atualizaEstoque(idProduto, quantidade);

      expect(produtoMock.estoque).toBe(5);
      expect(saveSpy).toHaveBeenCalledWith(produtoMock);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
