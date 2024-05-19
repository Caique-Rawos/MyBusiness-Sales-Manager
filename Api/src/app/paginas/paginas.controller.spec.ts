import { Test, TestingModule } from '@nestjs/testing';
import { PaginasController } from './paginas.controller';
import { PaginasService } from './paginas.service';
import { PaginasEntity } from './entity/paginas.entity';
import { PaginasModule } from './paginas.module';

describe('PaginasController', () => {
  let controller: PaginasController;
  let service: PaginasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaginasController],
      providers: [
        {
          provide: PaginasService,
          useValue: {
            getPaginaByAlias: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaginasController>(PaginasController);
    service = module.get<PaginasService>(PaginasService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [PaginasModule],
        controllers: [PaginasController],
        providers: [
          {
            provide: PaginasService,
            useValue: {
              getPaginaByAlias: jest.fn(),
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

  it('should return a PaginasEntity when getPagina is called', async () => {
    const alias = 'test-alias';
    const expectedResult: PaginasEntity = {
      id: 1,
      alias: 'test-alias',
      descricao: 'teste',
      arquivo: 'teste/teste.html',
      ativo: true,
    };

    jest.spyOn(service, 'getPaginaByAlias').mockResolvedValue(expectedResult);

    const result = await controller.getPagina(alias);
    expect(result).toEqual(expectedResult);
    expect(service.getPaginaByAlias).toHaveBeenCalledWith(alias);
  });
});
