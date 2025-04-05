import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaUpdateDto } from '../venda/dto/atualizaTotalVenda.dto';
import { ContasReceberService } from './contas_receber.service';
import { ContasReceberEntity } from './entity/contas_receber.entity';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  findOne: jest.fn().mockReturnValue({}),
};

describe('ContasReceberService', () => {
  let service: ContasReceberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContasReceberService,
        {
          provide: getRepositoryToken(ContasReceberEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ContasReceberService>(ContasReceberService);
  });

  it('should create a ContasReceberEntity', async () => {
    const requestData = {} as unknown as ContasReceberEntity;

    const spyCreate = jest
      .spyOn(repositoryMock, 'create')
      .mockReturnValue(requestData);
    const spySave = jest
      .spyOn(repositoryMock, 'save')
      .mockResolvedValue(requestData);

    const result = await service.create(requestData);

    expect(result).toEqual(requestData);
    expect(spyCreate).toHaveBeenCalledWith(requestData);
    expect(spySave).toHaveBeenCalledWith(requestData);
  });

  it('should find all ContasReceberEntity', async () => {
    const responseData = [];

    const spyFind = jest
      .spyOn(repositoryMock, 'find')
      .mockResolvedValue(responseData);

    const result = await service.findAll();

    expect(result).toEqual(responseData);
    expect(spyFind).toHaveBeenCalledWith({
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
    const spyFindOne = jest
      .spyOn(repositoryMock, 'findOne')
      .mockResolvedValue(receber);
    const spySave = jest
      .spyOn(repositoryMock, 'save')
      .mockResolvedValue(receber);

    await service.atualizaTotal(vendaUpdateDto);

    expect(spyFindOne).toHaveBeenCalledWith({
      where: { idVenda: vendaUpdateDto.id_venda },
    });
    expect(spySave).toHaveBeenCalledWith(receber);
    expect(receber.valorTotal).toBe(vendaUpdateDto.total);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
