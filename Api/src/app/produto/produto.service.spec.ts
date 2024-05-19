import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { Repository } from 'typeorm';
import { ProdutoEntity } from './entity/produtos.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let repository: Repository<ProdutoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: getRepositoryToken(ProdutoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<ProdutoEntity>>(
      getRepositoryToken(ProdutoEntity),
    );
  });

  it('should create a produto entity', async () => {
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

    jest.spyOn(repository, 'create').mockReturnValue(produtoData);
    jest.spyOn(repository, 'save').mockResolvedValue(produtoData);

    const result = await service.create(produtoData);

    expect(result).toEqual(produtoData);
    expect(repository.create).toHaveBeenCalledWith(produtoData);
    expect(repository.save).toHaveBeenCalledWith(produtoData);
  });

  it('should return a list of produtos', async () => {
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

    jest.spyOn(repository, 'find').mockResolvedValue(produtos);

    const result = await service.findAll();

    expect(result).toEqual(produtos);
    expect(repository.find).toHaveBeenCalled();
  });
});
