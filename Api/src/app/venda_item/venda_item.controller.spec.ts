import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemEntity } from './entity/venda_item.entity';
import { VendaItemController } from './venda_item.controller';
import { VendaItemService } from './venda_item.service';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByIdVenda: jest.fn(),
  novoTotalVenda: jest.fn(),
  atualizaEstoqueProduto: jest.fn(),
};

describe('VendaItemController', () => {
  let controller: VendaItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaItemController],
      providers: [
        {
          provide: VendaItemService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VendaItemController>(VendaItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a venda item', async () => {
    const vendaItemData = {} as unknown as VendaItemEntity;

    const spyCreate = jest
      .spyOn(mockService, 'create')
      .mockResolvedValue(vendaItemData);

    const spyNovoTotal = jest.spyOn(mockService, 'novoTotalVenda');

    const result = await controller.create(vendaItemData);

    expect(result).toBe(vendaItemData);
    expect(spyCreate).toHaveBeenCalledWith(vendaItemData);
    expect(spyNovoTotal).toHaveBeenCalledWith(vendaItemData.idVenda);
  });

  it('should find all venda items', async () => {
    const vendaItems = [];

    const spyFindAll = jest
      .spyOn(mockService, 'findAll')
      .mockResolvedValue(vendaItems);

    const result = await controller.findAll();

    expect(result).toBe(vendaItems);
    expect(spyFindAll).toHaveBeenCalled();
  });

  it('should find venda items by id_venda', async () => {
    const id_venda = 1;
    const vendaItems = [];

    const spyFindBy = jest
      .spyOn(mockService, 'findByIdVenda')
      .mockResolvedValue(vendaItems);

    const result = await controller.findByIdVenda(id_venda);

    expect(result).toBe(vendaItems);
    expect(spyFindBy).toHaveBeenCalledWith(id_venda);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
