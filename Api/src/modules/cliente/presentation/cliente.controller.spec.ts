import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from '../application/Cliente.service';

describe('ClienteController', () => {
  let controller: ClienteController;
  let clienteService: jest.Mocked<ClienteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
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

    controller = module.get<ClienteController>(ClienteController);
    clienteService = module.get<ClienteService>(ClienteService) as jest.Mocked<ClienteService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const result = {} as any;
    clienteService.create.mockResolvedValue(result);
    await expect(controller.create({} as any)).resolves.toBe(result);
    expect(clienteService.create).toHaveBeenCalledWith({} as any);
  });

  it('should call findAll', async () => {
    const result = {} as any;
    clienteService.findAll.mockResolvedValue(result);
    await expect(controller.findAll()).resolves.toBe(result);
    expect(clienteService.findAll).toHaveBeenCalledWith();
  });

  it('should call findById', async () => {
    const result = {} as any;
    clienteService.findById.mockResolvedValue(result);
    await expect(controller.findById('1')).resolves.toBe(result);
    expect(clienteService.findById).toHaveBeenCalledWith(1);
  });

  it('should call update', async () => {
    const result = {} as any;
    clienteService.update.mockResolvedValue(result);
    await expect(controller.update('1', {} as any)).resolves.toBe(result);
    expect(clienteService.update).toHaveBeenCalledWith(1, {} as any);
  });

  it('should call delete', async () => {
    const result = {} as any;
    clienteService.delete.mockResolvedValue(result);
    await expect(controller.delete('1')).resolves.toBe(result);
    expect(clienteService.delete).toHaveBeenCalledWith(1);
  });
});
