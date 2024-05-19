import { Test, TestingModule } from '@nestjs/testing';
import { VendaService } from './venda.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaEntity } from './entity/venda.entity';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';
import { VendaUpdateDto } from './dto/atualizaTotalVenda.dto';
import { ClienteEntity } from '../cliente/entity/cliente.entity';

describe('VendaService', () => {
  let service: VendaService;
  let repository: Repository<VendaEntity>;
  let contasReceberService: ContasReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaService,
        ContasReceberService,
        {
          provide: getRepositoryToken(VendaEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ContasReceberEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VendaService>(VendaService);
    repository = module.get<Repository<VendaEntity>>(
      getRepositoryToken(VendaEntity),
    );
    contasReceberService =
      module.get<ContasReceberService>(ContasReceberService);
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

      const createdVenda: VendaEntity = {
        id: 1,
        totalVenda: 123,
        idCliente: 1,
        cliente: cliente,
      };

      jest.spyOn(repository, 'create').mockReturnValue(createdVenda);
      jest.spyOn(repository, 'save').mockResolvedValue(createdVenda);

      const result = await service.create(createdVenda);

      expect(result).toEqual(createdVenda);
      expect(result.cliente).toEqual(cliente);
      expect(repository.create).toHaveBeenCalledWith(createdVenda);
      expect(repository.save).toHaveBeenCalledWith(createdVenda);
    });
  });

  describe('findAll', () => {
    it('should return all vendas with cliente relations, ordered by id descending', async () => {
      const vendas: VendaEntity[] = [
        {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        {
          id: 2,
          totalVenda: 321,
          dataVenda: new Date(),
          idCliente: 2,
          cliente: { id: 2, nome: 'teste 2', cpfCnpj: '31232113211' },
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(vendas);

      const result = await service.findAll();

      expect(result).toEqual(vendas);
      expect(repository.find).toHaveBeenCalledWith({
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
      jest.spyOn(repository, 'findOne').mockResolvedValue(vendaEntity);
      jest.spyOn(repository, 'save').mockResolvedValue(vendaEntity);
      jest.spyOn(contasReceberService, 'atualizaTotal').mockResolvedValue();

      await service.atualizaTotal(vendaUpdateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: vendaUpdateDto.id_venda },
      });
      expect(repository.save).toHaveBeenCalledWith(vendaEntity);
      expect(contasReceberService.atualizaTotal).toHaveBeenCalledWith(
        vendaUpdateDto,
      );
    });
  });
});
