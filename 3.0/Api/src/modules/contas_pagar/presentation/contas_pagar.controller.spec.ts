import { Test, TestingModule } from '@nestjs/testing';
import { ContasPagarService } from '../application/contas_pagar.service';
import { ContasPagarController } from './contas_pagar.controller';

describe('ContasPagarController', () => {
  let controller: ContasPagarController;
  let contasPagarService: jest.Mocked<ContasPagarService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasPagarController],
      providers: [
        {
          provide: ContasPagarService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContasPagarController>(ContasPagarController);
    contasPagarService = module.get<ContasPagarService>(
      ContasPagarService,
    ) as jest.Mocked<ContasPagarService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    contasPagarService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(contasPagarService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    contasPagarService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(contasPagarService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    contasPagarService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(contasPagarService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    contasPagarService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(contasPagarService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    contasPagarService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(contasPagarService.delete).toHaveBeenCalledWith(1);
  });
});
