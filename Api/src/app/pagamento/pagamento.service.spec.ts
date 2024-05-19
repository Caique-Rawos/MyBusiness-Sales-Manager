import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service';
import { Repository } from 'typeorm';
import { PagamentoEntity } from './entity/pagamento.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PagamentoService', () => {
  let service: PagamentoService;
  let repository: Repository<PagamentoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: getRepositoryToken(PagamentoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
    repository = module.get<Repository<PagamentoEntity>>(
      getRepositoryToken(PagamentoEntity),
    );
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

      jest.spyOn(repository, 'create').mockReturnValue(pagamentoData);
      jest.spyOn(repository, 'save').mockResolvedValue(pagamentoData);

      const result = await service.create(pagamentoData);

      expect(result).toEqual(pagamentoData);
      expect(repository.create).toHaveBeenCalledWith(pagamentoData);
      expect(repository.save).toHaveBeenCalledWith(pagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payments: PagamentoEntity[] = [
        {
          id: 1,
          descricao: 'Dinheiro',
        },
        {
          id: 2,
          descricao: 'Cartao',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(payments);

      const result = await service.findAll();

      expect(result).toEqual(payments);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
