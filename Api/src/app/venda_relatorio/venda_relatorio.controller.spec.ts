import { Test, TestingModule } from '@nestjs/testing';
import { VendaRelatorioController } from './venda_relatorio.controller';
import { VendaRelatorioService } from './venda_relatorio.service';

const mockService = {
  findAllGroupByCliente: jest.fn(),
  findAll: jest.fn(),
  generateCupomFiscal: jest.fn(),
};

describe('VendaRelatorioController', () => {
  let controller: VendaRelatorioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaRelatorioController],
      providers: [
        {
          provide: VendaRelatorioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VendaRelatorioController>(VendaRelatorioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should findAll vendas', async () => {
      const vendaData = {};

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(vendaData);

      const result = await controller.findAll({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });

      expect(result).toEqual(vendaData);
      expect(spyFindAll).toHaveBeenCalledWith({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });
    });
  });

  describe('findAllGroupByCliente', () => {
    it('should return all vendas grouped by cliente', async () => {
      const vendas = {};

      const spyFindAllGroupByCliente = jest
        .spyOn(mockService, 'findAllGroupByCliente')
        .mockResolvedValue(vendas);

      const result = await controller.findAllGroupByCliente({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });

      expect(result).toEqual(vendas);
      expect(spyFindAllGroupByCliente).toHaveBeenCalledWith({
        dataInicio: new Date('2024-10-27'),
        dataFim: new Date('2024-10-27'),
      });
    });
  });

  describe('generateCupomFiscal', () => {
    it('should return data to cupom fiscal', async () => {
      const cupomFiscal = {};

      const spyGenerateCupomFiscal = jest
        .spyOn(mockService, 'generateCupomFiscal')
        .mockResolvedValue(cupomFiscal);

      const result = await controller.generateCupomFiscal({
        idVenda: 1,
      });

      expect(result).toEqual(cupomFiscal);
      expect(spyGenerateCupomFiscal).toHaveBeenCalledWith({
        idVenda: 1,
      });
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
