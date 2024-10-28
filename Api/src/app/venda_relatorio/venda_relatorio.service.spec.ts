import { Test, TestingModule } from '@nestjs/testing';
import { VendaRelatorioService } from './venda_relatorio.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaEntity } from '../venda/entity/venda.entity';
import { IFiltroRelatorio } from './interface/filtro_relatorio.interface';

describe('VendaService', () => {
  let service: VendaRelatorioService;
  let repository: Repository<VendaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaRelatorioService,
        {
          provide: getRepositoryToken(VendaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VendaRelatorioService>(VendaRelatorioService);
    repository = module.get<Repository<VendaEntity>>(
      getRepositoryToken(VendaEntity),
    );
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

      jest.spyOn(repository, 'find').mockResolvedValue(mockVendas as any);

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

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
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
});
