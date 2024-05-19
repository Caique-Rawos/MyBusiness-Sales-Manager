import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoController } from './status_pagamento.controller';
import { StatusPagamentoService } from './status_pagamento.service';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { StatusPagamentoModule } from './status_pagamento.module';

describe('StatusPagamentoController', () => {
  let controller: StatusPagamentoController;
  let service: StatusPagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPagamentoController],
      providers: [
        {
          provide: StatusPagamentoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatusPagamentoController>(
      StatusPagamentoController,
    );
    service = module.get<StatusPagamentoService>(StatusPagamentoService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [StatusPagamentoModule],
        controllers: [StatusPagamentoController],
        providers: [
          {
            provide: StatusPagamentoService,
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
    it('should create a new status pagamento', async () => {
      const statusPagamentoData: StatusPagamentoEntity = {
        id: 1,
        descricao: 'Pago',
        cor: 'green',
      };

      jest.spyOn(service, 'create').mockResolvedValue(statusPagamentoData);

      const result = await controller.create(statusPagamentoData);

      expect(result).toEqual(statusPagamentoData);
      expect(service.create).toHaveBeenCalledWith(statusPagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all status pagamentos', async () => {
      const statusPagamentos: StatusPagamentoEntity[] = [
        {
          id: 1,
          descricao: 'Pago',
          cor: 'green',
        },
        {
          id: 2,
          descricao: 'Em Aberto',
          cor: 'orange',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(statusPagamentos);

      const result = await controller.findAll();

      expect(result).toEqual(statusPagamentos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
