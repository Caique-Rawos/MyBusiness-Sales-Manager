import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginasEntity } from './entity/paginas.entity';
import { PaginasService } from './paginas.service';

const repositoryMock = {
  findOne: jest.fn().mockReturnValue({}),
};

describe('PaginasService', () => {
  let service: PaginasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginasService,
        {
          provide: getRepositoryToken(PaginasEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<PaginasService>(PaginasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a PaginasEntity when getPaginaByAlias is called', async () => {
    const alias = 'test-alias';
    const expectedResult: PaginasEntity = {
      id: 1,
      alias: 'test-alias',
      descricao: 'teste',
      arquivo: 'teste/teste.html',
      ativo: true,
    };

    const spyFindOne = jest
      .spyOn(repositoryMock, 'findOne')
      .mockResolvedValue(expectedResult);

    const result = await service.getPaginaByAlias(alias);
    expect(result).toEqual(expectedResult);
    expect(spyFindOne).toHaveBeenCalledWith({
      where: { alias: alias },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
