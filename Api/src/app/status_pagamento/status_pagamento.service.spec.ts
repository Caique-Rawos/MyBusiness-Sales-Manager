import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoService } from './status_pagamento.service';
import { Repository } from 'typeorm';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('StatusPagamentoService', () => {
  let service: StatusPagamentoService;
  let repository: Repository<StatusPagamentoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusPagamentoService,
        {
          provide: getRepositoryToken(StatusPagamentoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StatusPagamentoService>(StatusPagamentoService);
    repository = module.get<Repository<StatusPagamentoEntity>>(
      getRepositoryToken(StatusPagamentoEntity),
    );
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

      jest.spyOn(repository, 'create').mockReturnValue(statusPagamentoData);
      jest.spyOn(repository, 'save').mockResolvedValue(statusPagamentoData);

      const result = await service.create(statusPagamentoData);

      expect(result).toEqual(statusPagamentoData);
      expect(repository.create).toHaveBeenCalledWith(statusPagamentoData);
      expect(repository.save).toHaveBeenCalledWith(statusPagamentoData);
    });
  });

  describe('findAll', () => {
    it('should return all status pagamentos', async () => {
      const statusPagamentos: StatusPagamentoEntity[] = [
        {
          id: 1,
          descricao: 'Pago',
          cor: 'green',
        },
        {
          id: 2,
          descricao: 'Em Aberto',
          cor: 'orange',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(statusPagamentos);

      const result = await service.findAll();

      expect(result).toEqual(statusPagamentos);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
