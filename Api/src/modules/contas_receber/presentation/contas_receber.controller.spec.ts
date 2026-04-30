import { Test, TestingModule } from '@nestjs/testing';
import { ContasReceberService } from '../application/contas_receber.service';
import { ContasReceberController } from './contas_receber.controller';

describe('ContasReceberController', () => {
  let controller: ContasReceberController;
  let contasReceberService: jest.Mocked<ContasReceberService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContasReceberController],
      providers: [
        {
          provide: ContasReceberService,
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

    controller = module.get<ContasReceberController>(ContasReceberController);
    contasReceberService = module.get<ContasReceberService>(
      ContasReceberService,
    ) as jest.Mocked<ContasReceberService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    contasReceberService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(contasReceberService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    contasReceberService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(contasReceberService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    contasReceberService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(contasReceberService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    contasReceberService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(contasReceberService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    contasReceberService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(contasReceberService.delete).toHaveBeenCalledWith(1);
  });
});
