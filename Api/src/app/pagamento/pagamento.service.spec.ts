import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PagamentoEntity } from './entity/pagamento.entity';
import { PagamentoService } from './pagamento.service';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('PagamentoService', () => {
  let service: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: getRepositoryToken(PagamentoEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const pagamentoData: PagamentoEntity = {
        id: 1,
        descricao: 'Dinheiro',
      };

      const spyCreate = jest
        .spyOn(repositoryMock, 'create')
        .mockReturnValue(pagamentoData);
      const spySave = jest
        .spyOn(repositoryMock, 'save')
        .mockResolvedValue(pagamentoData);

      const result = await service.create(pagamentoData);

      expect(result).toEqual(pagamentoData);
      expect(spyCreate).toHaveBeenCalledWith(pagamentoData);
      expect(spySave).toHaveBeenCalledWith(pagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments = [];

      const spyFind = jest
        .spyOn(repositoryMock, 'find')
        .mockResolvedValue(payments);

      const result = await service.findAll();

      expect(result).toEqual(payments);
      expect(spyFind).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
