import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/entity/cliente.entity';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';
import { VendaEntity } from './entity/venda.entity';
import { VendaService } from './venda.service';

const vendaRepositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  findOne: jest.fn().mockReturnValue({}),
};

const mockServiceContasReceber = {
  atualizaTotal: jest.fn(),
};

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
