import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarEntity } from './entity/contas_pagar.entity';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('ContasPagarService', () => {
  let service: ContasPagarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContasPagarService,
        {
          provide: getRepositoryToken(ContasPagarEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ContasPagarService>(ContasPagarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ContasPagarEntity', async () => {
      const data = {} as unknown as ContasPagarEntity;

      const spyCreate = jest
        .spyOn(repositoryMock, 'create')
        .mockReturnValue(data);
      const spySave = jest
        .spyOn(repositoryMock, 'save')
        .mockResolvedValue(data);

      const result = await service.create(data);

      expect(result).toEqual(data);
      expect(spyCreate).toHaveBeenCalledWith(data);
      expect(spySave).toHaveBeenCalledWith(data);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasPagarEntity', async () => {
      const mockEntities = [];

      const spyFind = jest
        .spyOn(repositoryMock, 'find')
        .mockResolvedValue(mockEntities);

      const result = await service.findAll();

      expect(result).toEqual(mockEntities);
      expect(spyFind).toHaveBeenCalledWith({
        relations: ['pagamento', 'statusPagamento'],
        order: {
          id: 'DESC',
        },
      });
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
