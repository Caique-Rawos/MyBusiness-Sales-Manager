import { Test, TestingModule } from '@nestjs/testing';
import { VendaRelatorioController } from './venda_relatorio.controller';
import { VendaRelatorioService } from './venda_relatorio.service';
import { VendaRelatorioModule } from './venda_relatorio.module';
import {
  IVendaClienteRelatorio,
  IVendaRelatorio,
} from './interface/venda_relatorio.interface';

describe('VendaRelatorioController', () => {
  let controller: VendaRelatorioController;
  let service: VendaRelatorioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaRelatorioController],
      providers: [
        {
          provide: VendaRelatorioService,
          useValue: {
            findAllGroupByCliente: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaRelatorioController>(VendaRelatorioController);
    service = module.get<VendaRelatorioService>(VendaRelatorioService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [VendaRelatorioModule],
        controllers: [VendaRelatorioController],
        providers: [
          {
            provide: VendaRelatorioService,
            useValue: {
              findAllGroupByCliente: jest.fn(),
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

  describe('findAll', () => {
    it('should findAll vendas', async () => {
      const vendaData: { vendas: IVendaRelatorio[]; totalVendas: number } = {
        vendas: [
          {
            idVenda: 1,
            valorVenda: 12,
            dataVenda: new Date('2024-10-27'),
            nomeCliente: 'jorge',
            idCliente: 1,
          },
        ],
        totalVendas: 12,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(vendaData);

      const result = await controller.findAll({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });

      expect(result).toEqual(vendaData);
      expect(service.findAll).toHaveBeenCalledWith({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });
    });
  });

  describe('findAllGroupByCliente', () => {
    it('should return all vendas grouped by cliente', async () => {
      const vendas: {
        vendas: IVendaClienteRelatorio[];
        totalVendas: number;
        quantidadeTotal: number;
      } = {
        vendas: [
          {
            idCliente: 1,
            nomeCliente: 'jorge',
            valorVendas: 12,
            quantidadeVendas: 1,
          },
        ],
        totalVendas: 12,
        quantidadeTotal: 1,
      };
      jest.spyOn(service, 'findAllGroupByCliente').mockResolvedValue(vendas);

      const result = await controller.findAllGroupByCliente({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });

      expect(result).toEqual(vendas);
      expect(service.findAllGroupByCliente).toHaveBeenCalledWith({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });
    });
  });
});
