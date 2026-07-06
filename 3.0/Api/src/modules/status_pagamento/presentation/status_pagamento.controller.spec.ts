import { Test, TestingModule } from '@nestjs/testing';
import { StatusPagamentoService } from '../application/status_pagamento.service';
import { StatusPagamentoController } from './status_pagamento.controller';

describe('StatusPagamentoController', () => {
  let controller: StatusPagamentoController;
  let statusPagamentoService: jest.Mocked<StatusPagamentoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPagamentoController],
      providers: [
        {
          provide: StatusPagamentoService,
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

    controller = module.get<StatusPagamentoController>(
      StatusPagamentoController,
    );
    statusPagamentoService = module.get<StatusPagamentoService>(
      StatusPagamentoService,
    ) as jest.Mocked<StatusPagamentoService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    statusPagamentoService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(statusPagamentoService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    statusPagamentoService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(statusPagamentoService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    statusPagamentoService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(statusPagamentoService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    statusPagamentoService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(statusPagamentoService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    statusPagamentoService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(statusPagamentoService.delete).toHaveBeenCalledWith(1);
  });
});
