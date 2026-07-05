import { Test, TestingModule } from '@nestjs/testing';
import { VendaRelatorioService } from '../application/venda_relatorio.service';
import { VendaRelatorioController } from './venda_relatorio.controller';

describe('VendaRelatorioController', () => {
  let controller: VendaRelatorioController;
  let vendaRelatorioService: jest.Mocked<VendaRelatorioService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaRelatorioController],
      providers: [
        {
          provide: VendaRelatorioService,
          useValue: {
            findAll: jest.fn(),
            findAllGroupByCliente: jest.fn(),
            findAllGroupByData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaRelatorioController>(VendaRelatorioController);
    vendaRelatorioService = module.get<VendaRelatorioService>(
      VendaRelatorioService,
    ) as jest.Mocked<VendaRelatorioService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const result = {} as any;
    vendaRelatorioService.findAll.mockResolvedValue(result);
    await expect(controller.findAll({} as any)).resolves.toBe(result);
    expect(vendaRelatorioService.findAll).toHaveBeenCalledWith({} as any);
  });

  it('should call findAllGroupByCliente', async () => {
    const result = {} as any;
    vendaRelatorioService.findAllGroupByCliente.mockResolvedValue(result);
    await expect(controller.findAllGroupByCliente({} as any)).resolves.toBe(
      result,
    );
    expect(vendaRelatorioService.findAllGroupByCliente).toHaveBeenCalledWith(
      {} as any,
    );
  });

  it('should call findAllGroupByData', async () => {
    const result = {} as any;
    vendaRelatorioService.findAllGroupByData.mockResolvedValue(result);
    await expect(controller.findAllGroupByData({} as any)).resolves.toBe(
      result,
    );
    expect(vendaRelatorioService.findAllGroupByData).toHaveBeenCalledWith(
      {} as any,
    );
  });

  it('should call generateCupomFiscal', async () => {
    const result = {} as any;
    vendaRelatorioService.generateCupomFiscal = jest
      .fn()
      .mockResolvedValue(result);
    await expect(controller.generateCupomFiscal({ idVenda: 1 })).resolves.toBe(
      result,
    );
    expect(vendaRelatorioService.generateCupomFiscal).toHaveBeenCalledWith({
      idVenda: 1,
    });
  });
});
