import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoEntity } from './entity/produtos.entity';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};
describe('ProdutoController', () => {
  let controller: ProdutoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const produtoData = {} as unknown as ProdutoEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(produtoData);

      const result = await controller.create(produtoData);

      expect(result).toEqual(produtoData);
      expect(spyCreate).toHaveBeenCalledWith(produtoData);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const produtos = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(produtos);

      const result = await controller.findAll();

      expect(result).toEqual(produtos);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
