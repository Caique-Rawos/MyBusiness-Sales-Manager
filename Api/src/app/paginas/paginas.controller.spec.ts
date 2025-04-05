import { Test, TestingModule } from '@nestjs/testing';
import { PaginasEntity } from './entity/paginas.entity';
import { PaginasController } from './paginas.controller';
import { PaginasService } from './paginas.service';

const mockService = {
  getPaginaByAlias: jest.fn(),
};

describe('PaginasController', () => {
  let controller: PaginasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaginasController],
      providers: [
        {
          provide: PaginasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PaginasController>(PaginasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a PaginasEntity when getPagina is called', async () => {
    const alias = 'test-alias';
    const expectedResult: PaginasEntity = {
      id: 1,
      alias: 'test-alias',
      descricao: 'teste',
      arquivo: 'teste/teste.html',
      ativo: true,
    };

    const spyGetPaginaByAlias = jest
      .spyOn(mockService, 'getPaginaByAlias')
      .mockResolvedValue(expectedResult);

    const result = await controller.getPagina(alias);
    expect(result).toEqual(expectedResult);
    expect(spyGetPaginaByAlias).toHaveBeenCalledWith(alias);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
