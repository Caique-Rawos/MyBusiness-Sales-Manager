import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProdutoService } from '../produto/produto.service';
import { VendaService } from '../venda/venda.service';
import { VendaItemEntity } from './entity/venda_item.entity';
import { VendaItemService } from './venda_item.service';

const mockServiceVenda = {
  atualizaTotal: jest.fn(),
};

const mockServiceProduto = {
  atualizaEstoque: jest.fn(),
};

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  findOne: jest.fn().mockReturnValue({}),
};

describe('VendaItemService', () => {
  let service: VendaItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaItemService,
        {
          provide: VendaService,
          useValue: mockServiceVenda,
        },
        {
          provide: ProdutoService,
          useValue: mockServiceProduto,
        },
        {
          provide: getRepositoryToken(VendaItemEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<VendaItemService>(VendaItemService);
  });

  it('should create a venda item entity', async () => {
    const vendaItemData = {} as unknown as VendaItemEntity;

    const spyCreate = jest
      .spyOn(repositoryMock, 'create')
      .mockReturnValue(vendaItemData);

    const spySave = jest
      .spyOn(repositoryMock, 'save')
      .mockResolvedValue(vendaItemData);

    const result = await service.create(vendaItemData);

    expect(result).toEqual(vendaItemData);
    expect(spyCreate).toHaveBeenCalledWith(vendaItemData);
    expect(spySave).toHaveBeenCalledWith(vendaItemData);
  });

  it('should return a list of venda items', async () => {
    const vendaItems = [];

    const spyFind = jest
      .spyOn(repositoryMock, 'find')
      .mockResolvedValue(vendaItems);

    const result = await service.findAll();

    expect(result).toEqual(vendaItems);
    expect(spyFind).toHaveBeenCalled();
  });

  it('should return a list of venda items by venda id', async () => {
    const idVenda = 1;
    const vendaItems = [];

    const spyFind = jest
      .spyOn(repositoryMock, 'find')
      .mockResolvedValue(vendaItems);

    const result = await service.findByIdVenda(idVenda);

    expect(result).toEqual(vendaItems);
    expect(spyFind).toHaveBeenCalledWith({
      where: { venda: { id: idVenda } },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
      order: { id: 'DESC' },
    });
  });

  it('should calculate total subtotals and update total venda', async () => {
    const idVenda = 1;
    const vendaItems = [{ subTotal: 12 } as unknown as VendaItemEntity];

    const spyFindByIdVenda = jest
      .spyOn(service, 'findByIdVenda')
      .mockResolvedValue(vendaItems);

    const spyAtualizaTotal = jest.spyOn(mockServiceVenda, 'atualizaTotal');

    await service.novoTotalVenda(idVenda);

    expect(spyFindByIdVenda).toHaveBeenCalledWith(idVenda);
    expect(spyAtualizaTotal).toHaveBeenCalled();
  });

  describe('atualizaEstoqueProduto', () => {
    it('should call atualizaEstoque with correct parameters', async () => {
      const idProduto = 1;
      const quantidade = 5;

      const atualizaEstoqueSpy = jest.spyOn(
        mockServiceProduto,
        'atualizaEstoque',
      );

      await service.atualizaEstoqueProduto(idProduto, quantidade);

      expect(atualizaEstoqueSpy).toHaveBeenCalledWith(idProduto, quantidade);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
