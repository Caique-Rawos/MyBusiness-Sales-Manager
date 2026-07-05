import { Test, TestingModule } from '@nestjs/testing';
import { VendaController } from './venda.controller';
import { VendaService } from '../application/Venda.service';

describe('VendaController', () => {
  let controller: VendaController;
  let vendaService: jest.Mocked<VendaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [
        {
          provide: VendaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findVendasFuturas: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaController>(VendaController);
    vendaService = module.get<VendaService>(VendaService) as jest.Mocked<VendaService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    vendaService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(vendaService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    vendaService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(vendaService.findAll).toHaveBeenCalledWith();
  });

  it('should call findVendasFuturas', async () => {
    const result = {} as any;
    vendaService.findVendasFuturas.mockResolvedValue(result);
    await expect(controller.findVendasFuturas()).resolves.toBe(result);
    expect(vendaService.findVendasFuturas).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    vendaService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(vendaService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    vendaService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(vendaService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    vendaService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(vendaService.delete).toHaveBeenCalledWith(1);
  });
});
