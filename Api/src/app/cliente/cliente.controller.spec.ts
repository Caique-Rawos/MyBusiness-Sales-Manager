import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './entity/cliente.entity';
import { ClienteModule } from './cliente.module';

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: ClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get<ClienteService>(ClienteService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [ClienteModule],
        controllers: [ClienteController],
        providers: [
          {
            provide: ClienteService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
            },
          },
        ],
      }).compile();
    } catch (error) {
      /* EMPTY */
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clienteData: ClienteEntity = {
        id: 1,
        nome: 'Teste',
        cpfCnpj: '123231123',
      };

      jest.spyOn(service, 'create').mockResolvedValue(clienteData);

      const result = await controller.create(clienteData);

      expect(result).toEqual(clienteData);
      expect(service.create).toHaveBeenCalledWith(clienteData);
    });
  });

  describe('findAll', () => {
    it('should return all clients', async () => {
      const clients: ClienteEntity[] = [
        // Defina os clientes aqui
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(clients);

      const result = await controller.findAll();

      expect(result).toEqual(clients);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
