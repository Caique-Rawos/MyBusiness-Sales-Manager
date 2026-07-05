import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemService } from '../application/venda_item.service';
import { VendaItemController } from './venda_item.controller';

describe('VendaItemController', () => {
  let controller: VendaItemController;
  let vendaItemService: jest.Mocked<VendaItemService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaItemController],
      providers: [
        {
          provide: VendaItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByIdVenda: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            novoTotalVenda: jest.fn(),
            atualizaEstoqueProduto: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaItemController>(VendaItemController);
    vendaItemService = module.get<VendaItemService>(
      VendaItemService,
    ) as jest.Mocked<VendaItemService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    vendaItemService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(vendaItemService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    vendaItemService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(vendaItemService.findAll).toHaveBeenCalledWith();
  });

  it('should call findByIdVenda', async () => {
    const result = {} as any;
    vendaItemService.findByIdVenda.mockResolvedValue(result);
    await expect(controller.findByIdVenda(1)).resolves.toBe(result);
    expect(vendaItemService.findByIdVenda).toHaveBeenCalledWith(1);
  });

  it('should call findById', async () => {
    const result = {} as any;
    vendaItemService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(vendaItemService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    vendaItemService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(vendaItemService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    vendaItemService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(vendaItemService.delete).toHaveBeenCalledWith(1);
  });
});
