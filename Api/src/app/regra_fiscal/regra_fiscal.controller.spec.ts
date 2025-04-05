import { Test, TestingModule } from '@nestjs/testing';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';
import { RegraFiscalController } from './regra_fiscal.controller';
import { RegraFiscalService } from './regra_fiscal.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('RegraFiscalController', () => {
  let controller: RegraFiscalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegraFiscalController],
      providers: [
        {
          provide: RegraFiscalService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RegraFiscalController>(RegraFiscalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const regraFiscalData = {} as unknown as RegraFiscalEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(regraFiscalData);

      const result = await controller.create(regraFiscalData);

      expect(result).toEqual(regraFiscalData);
      expect(spyCreate).toHaveBeenCalledWith(regraFiscalData);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const regraFiscais = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(regraFiscais);

      const result = await controller.findAll();

      expect(result).toEqual(regraFiscais);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
