import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './regra_fiscal.controller';
import { CategoriaService } from './regra_fiscal.service';
import { CategoriaEntity } from './entity/regra_fiscal.entity';
import { CategoriaModule } from './regra_fiscal.module';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  let service: CategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    service = module.get<CategoriaService>(CategoriaService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [CategoriaModule],
        controllers: [CategoriaController],
        providers: [
          {
            provide: CategoriaService,
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
    it('should create a new category', async () => {
      const categoryData: CategoriaEntity = {
        id: 1,
        descricao: 'teste',
      };

      jest.spyOn(service, 'create').mockResolvedValue(categoryData);

      const result = await controller.create(categoryData);

      expect(result).toEqual(categoryData);
      expect(service.create).toHaveBeenCalledWith(categoryData);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories: CategoriaEntity[] = [
        // Defina as categorias aqui
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toEqual(categories);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
