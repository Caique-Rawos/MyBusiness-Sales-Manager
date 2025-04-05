import { Test, TestingModule } from '@nestjs/testing';
import { VendaEntity } from './entity/venda.entity';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('VendaController', () => {
  let controller: VendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [
        {
          provide: VendaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VendaController>(VendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new venda', async () => {
      const vendaData = {} as unknown as VendaEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(vendaData);

      const result = await controller.create(vendaData);

      expect(result).toEqual(vendaData);
      expect(spyCreate).toHaveBeenCalledWith(vendaData);
    });
  });

  describe('findAll', () => {
    it('should return all vendas', async () => {
      const vendas = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(vendas);

      const result = await controller.findAll();

      expect(result).toEqual(vendas);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
