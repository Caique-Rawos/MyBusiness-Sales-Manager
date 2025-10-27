import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import { ClienteEntity } from '../cliente/entity/cliente.entity';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';
import { VendaEntity } from './entity/venda.entity';
import { VendaService } from './venda.service';

const queryBuilderMock = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getRawMany: jest.fn().mockResolvedValue([]),
};

const vendaRepositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  findOne: jest.fn().mockReturnValue({}),
  createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
};

const mockServiceContasReceber = {
  atualizaTotal: jest.fn(),
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VendaService', () => {
  let service: VendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaService,
        { provide: ContasReceberService, useValue: mockServiceContasReceber },
        {
          provide: getRepositoryToken(VendaEntity),
          useValue: vendaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<VendaService>(VendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a venda entity', async () => {
      const cliente: ClienteEntity = {
        id: 1,
        nome: 'teste',
        cpfCnpj: '3213213211',
      };

      const createdVenda = {
        id: 1,
        totalVenda: 123,
        idCliente: 1,
        cliente: cliente,
      } as unknown as VendaEntity;

      const spyCreate = jest
        .spyOn(vendaRepositoryMock, 'create')
        .mockReturnValue(createdVenda);

      const spySave = jest
        .spyOn(vendaRepositoryMock, 'save')
        .mockResolvedValue(createdVenda);

      const result = await service.create(createdVenda);

      expect(result).toEqual(createdVenda);
      expect(result.cliente).toEqual(cliente);
      expect(spyCreate).toHaveBeenCalledWith(createdVenda);
      expect(spySave).toHaveBeenCalledWith(createdVenda);
    });
  });

  describe('findAll', () => {
    it('should return all vendas with cliente relations, ordered by id descending', async () => {
      const vendas = [];
      const spyFind = jest
        .spyOn(vendaRepositoryMock, 'find')
        .mockResolvedValue(vendas);

      const result = await service.findAll();

      expect(result).toEqual(vendas);
      expect(spyFind).toHaveBeenCalledWith({
        relations: ['cliente'],
        order: {
          id: 'DESC',
        },
      });
    });
  });

  describe('findVendasFuturas', () => {
    it('should return all vendas with previsao venda', async () => {
      const vendas = [
        {
          mes: '08-2025',
          quantidadeVendas: 10,
          valorTotal: 1000,
          isPrevisao: false,
        },
        {
          mes: '09-2025',
          quantidadeVendas: 8,
          valorTotal: 850,
          isPrevisao: false,
        },
        {
          mes: '10-2025',
          quantidadeVendas: 6,
          valorTotal: 650,
          isPrevisao: false,
        },
      ];

      jest.spyOn(queryBuilderMock, 'getRawMany').mockResolvedValue(vendas);

      const mockPrevisao = [
        {
          mes: '11-2025',
          quantidadeVendas: 4,
          valorTotal: 550,
          isPrevisao: true,
        },
        {
          mes: '12-2025',
          quantidadeVendas: 2,
          valorTotal: 250,
          isPrevisao: true,
        },
      ];

      mockedAxios.post.mockResolvedValueOnce({ data: mockPrevisao });

      const result = await service.findVendasFuturas();

      expect(result).toEqual([...vendas, ...mockPrevisao]);
      expect(axios.post).toHaveBeenCalled();
    });
  });

  describe('atualizaTotal', () => {
    it('should update total and call contasReceberService', async () => {
      const vendaUpdateDto: VendaUpdateDto = {
        id_venda: 1,
        total: 100,
      };

      const vendaEntity = new VendaEntity();
      const spyFindOne = jest
        .spyOn(vendaRepositoryMock, 'findOne')
        .mockResolvedValue(vendaEntity);

      const spySave = jest
        .spyOn(vendaRepositoryMock, 'save')
        .mockResolvedValue(vendaEntity);

      const spyAtualizaTotal = jest.spyOn(
        mockServiceContasReceber,
        'atualizaTotal',
      );

      await service.atualizaTotal(vendaUpdateDto);

      expect(spyFindOne).toHaveBeenCalledWith({
        where: { id: vendaUpdateDto.id_venda },
      });
      expect(spySave).toHaveBeenCalledWith(vendaEntity);
      expect(spyAtualizaTotal).toHaveBeenCalledWith(vendaUpdateDto);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
