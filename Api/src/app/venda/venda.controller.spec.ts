import { Test, TestingModule } from '@nestjs/testing';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';
import { VendaEntity } from './entity/venda.entity';
import { VendaModule } from './venda.module';

describe('VendaController', () => {
  let controller: VendaController;
  let service: VendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [
        {
          provide: VendaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaController>(VendaController);
    service = module.get<VendaService>(VendaService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [VendaModule],
        controllers: [VendaController],
        providers: [
          {
            provide: VendaService,
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
    it('should create a new venda', async () => {
      const vendaData: VendaEntity = {
        id: 1,
        totalVenda: 123,
        dataVenda: new Date(),
        idCliente: 1,
        cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
      };

      jest.spyOn(service, 'create').mockResolvedValue(vendaData);

      const result = await controller.create(vendaData);

      expect(result).toEqual(vendaData);
      expect(service.create).toHaveBeenCalledWith(vendaData);
    });
  });

  describe('findAll', () => {
    it('should return all vendas', async () => {
      const vendas: VendaEntity[] = [
        {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        {
          id: 2,
          totalVenda: 321,
          dataVenda: new Date(),
          idCliente: 2,
          cliente: { id: 2, nome: 'teste 2', cpfCnpj: '31232113211' },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(vendas);

      const result = await controller.findAll();

      expect(result).toEqual(vendas);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
