import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoEntity } from './entity/pagamento.entity';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('PagamentoController', () => {
  let controller: PagamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentoController],
      providers: [
        {
          provide: PagamentoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PagamentoController>(PagamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const pagamentoData: PagamentoEntity = {
        id: 1,
        descricao: 'Dinheiro',
      };

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(pagamentoData);

      const result = await controller.create(pagamentoData);

      expect(result).toEqual(pagamentoData);
      expect(spyCreate).toHaveBeenCalledWith(pagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(payments);

      const result = await controller.findAll();

      expect(result).toEqual(payments);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
