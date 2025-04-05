import { Test, TestingModule } from '@nestjs/testing';
import { LojaEntity } from './entity/loja.entity';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';

const mockService = {
  create: jest.fn(),
  findOnly: jest.fn(),
};

const lojaData = {} as unknown as LojaEntity;

describe('LojaController', () => {
  let controller: LojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
      providers: [
        {
          provide: LojaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LojaController>(LojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new loja', async () => {
      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(lojaData);

      const result = await controller.create(lojaData);

      expect(result).toEqual(lojaData);
      expect(spyCreate).toHaveBeenCalledWith(lojaData);
    });
  });

  describe('findOnly', () => {
    it('should return only lojas', async () => {
      const spyFindOnly = jest
        .spyOn(mockService, 'findOnly')
        .mockResolvedValue(lojaData);

      const result = await controller.findOnly();

      expect(result).toEqual(lojaData);
      expect(spyFindOnly).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
