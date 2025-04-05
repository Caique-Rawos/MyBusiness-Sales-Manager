import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { StatusPagamentoController } from './status_pagamento.controller';
import { StatusPagamentoService } from './status_pagamento.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('StatusPagamentoController', () => {
  let controller: StatusPagamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPagamentoController],
      providers: [
        {
          provide: StatusPagamentoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StatusPagamentoController>(
      StatusPagamentoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new status pagamento', async () => {
      const statusPagamentoData: StatusPagamentoEntity = {
        id: 1,
        descricao: 'Pago',
        cor: 'green',
      };

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(statusPagamentoData);

      const result = await controller.create(statusPagamentoData);

      expect(result).toEqual(statusPagamentoData);
      expect(spyCreate).toHaveBeenCalledWith(statusPagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all status pagamentos', async () => {
      const statusPagamentos = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(statusPagamentos);

      const result = await controller.findAll();

      expect(result).toEqual(statusPagamentos);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
