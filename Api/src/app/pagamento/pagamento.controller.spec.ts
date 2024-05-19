import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { PagamentoEntity } from './entity/pagamento.entity';
import { PagamentoModule } from './pagamento.module';

describe('PagamentoController', () => {
  let controller: PagamentoController;
  let service: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentoController],
      providers: [
        {
          provide: PagamentoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PagamentoController>(PagamentoController);
    service = module.get<PagamentoService>(PagamentoService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [PagamentoModule],
        controllers: [PagamentoController],
        providers: [
          {
            provide: PagamentoService,
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
    it('should create a new payment', async () => {
      const pagamentoData: PagamentoEntity = {
        id: 1,
        descricao: 'Dinheiro',
      };

      jest.spyOn(service, 'create').mockResolvedValue(pagamentoData);

      const result = await controller.create(pagamentoData);

      expect(result).toEqual(pagamentoData);
      expect(service.create).toHaveBeenCalledWith(pagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments: PagamentoEntity[] = [
        {
          id: 1,
          descricao: 'Dinheiro',
        },
        {
          id: 2,
          descricao: 'Cartao',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(payments);

      const result = await controller.findAll();

      expect(result).toEqual(payments);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
