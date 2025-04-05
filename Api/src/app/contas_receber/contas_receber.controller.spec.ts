import { Test, TestingModule } from '@nestjs/testing';
import { ContasReceberController } from './contas_receber.controller';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberEntity } from './entity/contas_receber.entity';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('ContasReceberController', () => {
  let controller: ContasReceberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasReceberController],
      providers: [
        {
          provide: ContasReceberService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContasReceberController>(ContasReceberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ContasReceberEntity', async () => {
      const requestData = {} as unknown as ContasReceberEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(requestData);

      const result = await controller.create(requestData);

      expect(result).toEqual(requestData);
      expect(spyCreate).toHaveBeenCalledWith(requestData);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasReceberEntity', async () => {
      const mockEntities = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(mockEntities);

      const result = await controller.findAll();

      expect(result).toEqual(mockEntities);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
