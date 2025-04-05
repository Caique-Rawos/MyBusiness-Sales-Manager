import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LojaService } from '../loja/loja.service';
import { VendaEntity } from '../venda/entity/venda.entity';
import { IFiltroRelatorio } from './interface/filtro_relatorio.interface';
import { VendaRelatorioService } from './venda_relatorio.service';

const mockLoja = {
  findOnly: jest.fn().mockResolvedValue({
    id: 1,
    nomeFantasia: 'teste',
    cpfCnpj: '1231323',
    ie: '12321',
    endereco: 'teste',
  }),
};

const repositoryMock = {
  find: jest.fn().mockReturnValue([]),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue({}),
  }),
};

describe('VendaService', () => {
  let service: VendaRelatorioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaRelatorioService,
        {
          provide: getRepositoryToken(VendaEntity),
          useValue: repositoryMock,
        },
        {
          provide: LojaService,
          useValue: mockLoja,
        },
      ],
    }).compile();

    service = module.get<VendaRelatorioService>(VendaRelatorioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return vendas e totalVendas correctly', async () => {
      const filtro: IFiltroRelatorio = {
        dataInicio: new Date('2024-10-01'),
        dataFim: new Date('2024-10-31'),
      };

      const mockVendas = [
        {
          id: 1,
          totalVenda: 100.0,
          dataVenda: new Date('2024-10-10'),
          cliente: { nome: 'Cliente A', id: 1 },
        },
        {
          id: 2,
          totalVenda: 200.0,
          dataVenda: new Date('2024-10-20'),
          cliente: { nome: 'Cliente B', id: 2 },
        },
      ];

      jest.spyOn(repositoryMock, 'find').mockResolvedValue(mockVendas as any);

      const resultado = await service.findAll(filtro);

      expect(resultado.vendas).toEqual([
        {
          idVenda: 1,
          valorVenda: 100.0,
          dataVenda: mockVendas[0].dataVenda,
          nomeCliente: 'Cliente A',
          idCliente: 1,
        },
        {
          idVenda: 2,
          valorVenda: 200.0,
          dataVenda: mockVendas[1].dataVenda,
          nomeCliente: 'Cliente B',
          idCliente: 2,
        },
      ]);

      expect(resultado.totalVendas).toBe(300.0);
    });
  });

  describe('findAllGroupByCliente', () => {
    it('should return grouped vendas by cliente', async () => {
      const filtro: IFiltroRelatorio = {
        dataInicio: new Date('2024-10-01'),
        dataFim: new Date('2024-10-31'),
      };

      const mockVendasPorCliente = [
        {
          idCliente: 1,
          nomeCliente: 'Cliente A',
          valorVendas: '300.00',
          quantidadeVendas: '3',
        },
        {
          idCliente: 2,
          nomeCliente: 'Cliente B',
          valorVendas: '200.00',
          quantidadeVendas: '2',
        },
      ];

      jest.spyOn(repositoryMock, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockVendasPorCliente),
      } as any);

      const resultado = await service.findAllGroupByCliente(filtro);

      expect(resultado).toEqual({
        vendas: [
          {
            idCliente: 1,
            nomeCliente: 'Cliente A',
            valorVendas: 300.0,
            quantidadeVendas: 3,
          },
          {
            idCliente: 2,
            nomeCliente: 'Cliente B',
            valorVendas: 200.0,
            quantidadeVendas: 2,
          },
        ],
        totalVendas: 500,
        quantidadeTotal: 5,
      });
    });
  });

  describe('generateCupomFiscal', () => {
    it('should return data to cupom fiscal', async () => {
      const filtro = {
        idVenda: 1,
      };

      const mockCupom = [
        {
          subtotal: 100,
          icms: 12,
          pis: 12,
          cofins: 12,
          ipi: 12,
        },
      ];

      jest.spyOn(repositoryMock, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockCupom),
      } as any);

      const resultado = await service.generateCupomFiscal(filtro);

      expect(resultado).toEqual({
        cupomItens: mockCupom,
        tributosAproximados: 48,
        totalVendas: 100,
        loja: {
          id: 1,
          nomeFantasia: 'teste',
          cpfCnpj: '1231323',
          ie: '12321',
          endereco: 'teste',
        },
      });
    });
  });
});
