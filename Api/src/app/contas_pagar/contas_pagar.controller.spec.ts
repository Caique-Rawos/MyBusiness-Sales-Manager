import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarController } from './contas_pagar.controller';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarEntity } from './entity/contas_pagar.entity';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('ContasPagarController', () => {
  let controller: ContasPagarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasPagarController],
      providers: [
        {
          provide: ContasPagarService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContasPagarController>(ContasPagarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ContasPagarEntity', async () => {
      const contasPagarData = {} as unknown as ContasPagarEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(contasPagarData);

      const result = await controller.create(contasPagarData);

      expect(result).toBe(contasPagarData);
      expect(spyCreate).toHaveBeenCalledWith(contasPagarData);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasPagarEntity', async () => {
      const contasPagarList = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(contasPagarList);

      const result = await controller.findAll();

      expect(result).toBe(contasPagarList);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
