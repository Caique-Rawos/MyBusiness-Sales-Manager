import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './entity/categoria.entity';

// Mock do repositório CategoriaEntity
const categoriaRepositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('CategoriaService', () => {
  let service: CategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(CategoriaEntity),
          useValue: categoriaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new categoria', async () => {
    const categoriaData: CategoriaEntity = {
      id: 1,
      descricao: 'teste',
    };

    await service.create(categoriaData);

    expect(categoriaRepositoryMock.create).toHaveBeenCalledWith(categoriaData);
    expect(categoriaRepositoryMock.save).toHaveBeenCalled();
  });

  it('should return all categorias', async () => {
    const result = await service.findAll();

    expect(categoriaRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
