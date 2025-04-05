import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './entity/cliente.entity';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
};

describe('ClienteController', () => {
  let controller: ClienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clienteData = {} as unknown as ClienteEntity;

      const spyCreate = jest
        .spyOn(mockService, 'create')
        .mockResolvedValue(clienteData);

      const result = await controller.create(clienteData);

      expect(result).toEqual(clienteData);
      expect(spyCreate).toHaveBeenCalledWith(clienteData);
    });
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      const clients = [];

      const spyFindAll = jest
        .spyOn(mockService, 'findAll')
        .mockResolvedValue(clients);

      const result = await controller.findAll();

      expect(result).toEqual(clients);
      expect(spyFindAll).toHaveBeenCalled();
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
