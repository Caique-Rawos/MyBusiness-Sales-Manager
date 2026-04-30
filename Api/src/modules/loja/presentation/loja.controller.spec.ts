import { Test, TestingModule } from '@nestjs/testing';
import { LojaController } from './loja.controller';
import { LojaService } from '../application/Loja.service';

describe('LojaController', () => {
  let controller: LojaController;
  let lojaService: jest.Mocked<LojaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
      providers: [
        {
          provide: LojaService,
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

    controller = module.get<LojaController>(LojaController);
    lojaService = module.get<LojaService>(LojaService) as jest.Mocked<LojaService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    lojaService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(lojaService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    lojaService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(lojaService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    lojaService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(lojaService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    lojaService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(lojaService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    lojaService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(lojaService.delete).toHaveBeenCalledWith(1);
  });
});
