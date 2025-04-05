import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { StatusPagamentoService } from './status_pagamento.service';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('StatusPagamentoService', () => {
  let service: StatusPagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusPagamentoService,
        {
          provide: getRepositoryToken(StatusPagamentoEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<StatusPagamentoService>(StatusPagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new status pagamento', async () => {
      const statusPagamentoData: StatusPagamentoEntity = {
        id: 1,
        descricao: 'Pago',
        cor: 'green',
      };

      const spyCreate = jest
        .spyOn(repositoryMock, 'create')
        .mockReturnValue(statusPagamentoData);
      const spySave = jest
        .spyOn(repositoryMock, 'save')
        .mockResolvedValue(statusPagamentoData);

      const result = await service.create(statusPagamentoData);

      expect(result).toEqual(statusPagamentoData);
      expect(spyCreate).toHaveBeenCalledWith(statusPagamentoData);
      expect(spySave).toHaveBeenCalledWith(statusPagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all status pagamentos', async () => {
      const statusPagamentos = [];

      const spyFind = jest
        .spyOn(repositoryMock, 'find')
        .mockResolvedValue(statusPagamentos);

      const result = await service.findAll();

      expect(result).toEqual(statusPagamentos);
      expect(spyFind).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
