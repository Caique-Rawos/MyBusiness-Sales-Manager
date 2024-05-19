import { Test, TestingModule } from '@nestjs/testing';
import { ContasReceberController } from './contas_receber.controller';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberEntity } from './entity/contas_receber.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContasReceberModule } from './contas_receber.module';

describe('ContasReceberController', () => {
  let controller: ContasReceberController;
  let service: ContasReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasReceberController],
      providers: [
        ContasReceberService,
        {
          provide: getRepositoryToken(ContasReceberEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ContasReceberController>(ContasReceberController);
    service = module.get<ContasReceberService>(ContasReceberService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [ContasReceberModule],
        controllers: [ContasReceberController],
        providers: [
          ContasReceberService,
          {
            provide: getRepositoryToken(ContasReceberEntity),
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
    it('should create a new ContasReceberEntity', async () => {
      const requestData: ContasReceberEntity = {
        id: 1,
        descricao: 'Descrição da conta a receber',
        valorTotal: 1000,
        valorPago: 0,
        dataVencimento: new Date(),
        idPagamento: 1,
        idStatusPagamento: 1,
        idVenda: 1,
        pagamento: {
          id: 1,
          descricao: 'Dinheiro',
        },
        statusPagamento: {
          id: 1,
          descricao: 'Pago',
          cor: 'green',
        },
        venda: {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
      };

      jest.spyOn(service, 'create').mockResolvedValue(requestData);

      const result = await controller.create(requestData);

      expect(result).toEqual(requestData);
      expect(service.create).toHaveBeenCalledWith(requestData);
    });
  });

  describe('findAll', () => {
    it('should return an array of ContasReceberEntity', async () => {
      const mockEntities: ContasReceberEntity[] = [
        {
          id: 1,
          descricao: 'Descrição da conta a receber',
          valorTotal: 1000,
          valorPago: 1000,
          dataVencimento: new Date(),
          idPagamento: 1,
          idStatusPagamento: 1,
          idVenda: 1,
          pagamento: {
            id: 1,
            descricao: 'Dinheiro',
          },
          statusPagamento: {
            id: 1,
            descricao: 'Pago',
            cor: 'green',
          },
          venda: {
            id: 1,
            totalVenda: 123,
            dataVenda: new Date(),
            idCliente: 1,
            cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
          },
        },
        {
          id: 2,
          descricao: 'Descrição da conta a receber 2',
          valorTotal: 1500,
          valorPago: 1500,
          dataVencimento: new Date(),
          idPagamento: 1,
          idStatusPagamento: 1,
          idVenda: 1,
          pagamento: {
            id: 1,
            descricao: 'Dinheiro',
          },
          statusPagamento: {
            id: 1,
            descricao: 'Pago',
            cor: 'green',
          },
          venda: {
            id: 1,
            totalVenda: 123,
            dataVenda: new Date(),
            idCliente: 1,
            cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockEntities);

      const result = await controller.findAll();

      expect(result).toEqual(mockEntities);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
