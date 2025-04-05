import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './entity/categoria.entity';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('CategoriaController', () => {
  let controller: CategoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [
        {
          provide: CategoriaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = {} as unknown as CategoriaEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(categoryData);

      const result = await controller.create(categoryData);

      expect(result).toEqual(categoryData);
      expect(spyCreate).toHaveBeenCalledWith(categoryData);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toEqual(categories);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
