import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarService } from './contas_pagar.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContasPagarEntity } from './entity/contas_pagar.entity';

describe('ContasPagarService', () => {
  let service: ContasPagarService;
  let repository: Repository<ContasPagarEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContasPagarService,
        {
          provide: getRepositoryToken(ContasPagarEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContasPagarService>(ContasPagarService);
    repository = module.get<Repository<ContasPagarEntity>>(
      getRepositoryToken(ContasPagarEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ContasPagarEntity', async () => {
      const data: ContasPagarEntity = {
        id: 1,
        descricao: 'Descrição da conta a pagar',
        valorTotal: 100.0,
        valorPago: 100.0,
        dataVencimento: new Date(),
        idPagamento: 1,
        idStatusPagamento: 1,
        pagamento: {
          id: 1,
          descricao: 'Dinheiro',
        },
        statusPagamento: {
          id: 1,
          descricao: 'Pago',
          cor: 'green',
        },
      };

      jest.spyOn(repository, 'create').mockReturnValue(data);
      jest.spyOn(repository, 'save').mockResolvedValue(data);

      const result = await service.create(data);

      expect(result).toEqual(data);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledWith(data);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasPagarEntity', async () => {
      const mockEntities: ContasPagarEntity[] = [
        {
          id: 1,
          descricao: 'Descrição da conta a pagar',
          valorTotal: 100.0,
          valorPago: 100.0,
          dataVencimento: new Date(),
          idPagamento: 1,
          idStatusPagamento: 1,
          pagamento: {
            id: 1,
            descricao: 'Dinheiro',
          },
          statusPagamento: {
            id: 1,
            descricao: 'Pago',
            cor: 'green',
          },
        },
        {
          id: 2,
          descricao: 'Aluguel',
          valorTotal: 800.0,
          valorPago: 800.0,
          dataVencimento: new Date(),
          idPagamento: 1,
          idStatusPagamento: 1,
          pagamento: {
            id: 1,
            descricao: 'Dinheiro',
          },
          statusPagamento: {
            id: 1,
            descricao: 'Pago',
            cor: 'green',
          },
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockEntities);

      const result = await service.findAll();

      expect(result).toEqual(mockEntities);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['pagamento', 'statusPagamento'],
        order: {
          id: 'DESC',
        },
      });
    });
  });
});
