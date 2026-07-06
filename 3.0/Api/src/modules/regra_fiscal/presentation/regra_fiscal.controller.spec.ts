import { Test, TestingModule } from '@nestjs/testing';
import { RegraFiscalService } from '../application/regra_fiscal.service';
import { RegraFiscalController } from './regra_fiscal.controller';

describe('RegraFiscalController', () => {
  let controller: RegraFiscalController;
  let regraFiscalService: jest.Mocked<RegraFiscalService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegraFiscalController],
      providers: [
        {
          provide: RegraFiscalService,
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

    controller = module.get<RegraFiscalController>(RegraFiscalController);
    regraFiscalService = module.get<RegraFiscalService>(
      RegraFiscalService,
    ) as jest.Mocked<RegraFiscalService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    regraFiscalService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(regraFiscalService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    regraFiscalService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(regraFiscalService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    regraFiscalService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(regraFiscalService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    regraFiscalService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(regraFiscalService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    regraFiscalService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(regraFiscalService.delete).toHaveBeenCalledWith(1);
  });
});
