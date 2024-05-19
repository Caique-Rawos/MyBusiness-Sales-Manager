import { Test, TestingModule } from '@nestjs/testing';
import { ContasReceberService } from './contas_receber.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContasReceberEntity } from './entity/contas_receber.entity';
import { VendaUpdateDto } from '../venda/dto/atualizaTotalVenda.dto';

describe('ContasReceberService', () => {
  let service: ContasReceberService;
  let repository: Repository<ContasReceberEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContasReceberService,
        {
          provide: getRepositoryToken(ContasReceberEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContasReceberService>(ContasReceberService);
    repository = module.get<Repository<ContasReceberEntity>>(
      getRepositoryToken(ContasReceberEntity),
    );
  });

  it('should create a ContasReceberEntity', async () => {
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

    jest.spyOn(repository, 'create').mockReturnValue(requestData);
    jest.spyOn(repository, 'save').mockResolvedValue(requestData);

    const result = await service.create(requestData);

    expect(result).toEqual(requestData);
    expect(repository.create).toHaveBeenCalledWith(requestData);
    expect(repository.save).toHaveBeenCalledWith(requestData);
  });

  it('should find all ContasReceberEntity', async () => {
    const responseData: ContasReceberEntity[] = [
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

    jest.spyOn(repository, 'find').mockResolvedValue(responseData);

    const result = await service.findAll();

    expect(result).toEqual(responseData);
    expect(repository.find).toHaveBeenCalledWith({
      relations: ['pagamento', 'statusPagamento', 'venda'],
      order: {
        id: 'DESC',
      },
    });
  });

  it('should update total of ContasReceberEntity', async () => {
    const vendaUpdateDto: VendaUpdateDto = {
      id_venda: 1,
      total: 100,
    };

    const receber = new ContasReceberEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValue(receber);
    jest.spyOn(repository, 'save').mockResolvedValue(receber);

    await service.atualizaTotal(vendaUpdateDto);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { idVenda: vendaUpdateDto.id_venda },
    });
    expect(repository.save).toHaveBeenCalledWith(receber);
    expect(receber.valorTotal).toBe(vendaUpdateDto.total);
  });
});
