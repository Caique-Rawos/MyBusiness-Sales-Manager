import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarController } from './contas_pagar.controller';
import { ContasPagarService } from './contas_pagar.service';
import { ContasPagarEntity } from './entity/contas_pagar.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContasPagarModule } from './contas_pagar.module';

describe('ContasPagarController', () => {
  let controller: ContasPagarController;
  let service: ContasPagarService;
  let repository: Repository<ContasPagarEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasPagarController],
      providers: [
        ContasPagarService,
        {
          provide: getRepositoryToken(ContasPagarEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ContasPagarController>(ContasPagarController);
    service = module.get<ContasPagarService>(ContasPagarService);
    repository = module.get<Repository<ContasPagarEntity>>(
      getRepositoryToken(ContasPagarEntity),
    );
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [ContasPagarModule],
        controllers: [ContasPagarController],
        providers: [
          ContasPagarService,
          {
            provide: getRepositoryToken(ContasPagarEntity),
            useClass: Repository,
          },
        ],
      }).compile();
    } catch (error) {
      /* EMPTY */
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ContasPagarEntity', async () => {
      const contasPagarData: ContasPagarEntity = {
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

      jest.spyOn(service, 'create').mockResolvedValue(contasPagarData);

      const result = await controller.create(contasPagarData);

      expect(result).toBe(contasPagarData);
      expect(service.create).toHaveBeenCalledWith(contasPagarData);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasPagarEntity', async () => {
      const contasPagarList: ContasPagarEntity[] = [
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

      jest.spyOn(service, 'findAll').mockResolvedValue(contasPagarList);

      const result = await controller.findAll();

      expect(result).toBe(contasPagarList);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
