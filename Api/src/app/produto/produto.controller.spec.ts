import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoEntity } from './entity/produtos.entity';
import { ProdutoModule } from './produto.module';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [ProdutoModule],
        controllers: [ProdutoController],
        providers: [
          {
            provide: ProdutoService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
            },
          },
        ],
      }).compile();
    } catch (error) {
      /* EMPTY */
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const produtoData: ProdutoEntity = {
        id: 1,
        descricao: 'Descrição do Produto',
        codigoDeBarra: '1234567890123',
        valorCusto: 50.0,
        valorVenda: 80.0,
        estoque: 100,
        unidade: 'UN',
        image: 'caminho/para/imagem.jpg',
        idCategoria: 1,
        categoria: { id: 1, descricao: 'produto' },
      };

      jest.spyOn(service, 'create').mockResolvedValue(produtoData);

      const result = await controller.create(produtoData);

      expect(result).toEqual(produtoData);
      expect(service.create).toHaveBeenCalledWith(produtoData);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const produtos: ProdutoEntity[] = [
        {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
        {
          id: 2,
          descricao: 'Descrição do Produto 2',
          codigoDeBarra: '12345123120123',
          valorCusto: 40.0,
          valorVenda: 50.0,
          estoque: 200,
          unidade: 'UN',
          image: '',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(produtos);

      const result = await controller.findAll();

      expect(result).toEqual(produtos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
