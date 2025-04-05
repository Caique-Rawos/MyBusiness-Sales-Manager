import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './entity/cliente.entity';

const repositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
};

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(ClienteEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clienteData = {} as unknown as ClienteEntity;

      const spyCreate = jest
        .spyOn(repositoryMock, 'create')
        .mockReturnValue(clienteData);

      const spySave = jest
        .spyOn(repositoryMock, 'save')
        .mockResolvedValue(clienteData);

      const result = await service.create(clienteData);

      expect(result).toEqual(clienteData);
      expect(spyCreate).toHaveBeenCalledWith(clienteData);
      expect(spySave).toHaveBeenCalledWith(clienteData);
    });
  });

  describe('findAll', () => {
    it('should return all clients ordered by id in descending order', async () => {
      const clients = [];

      const spyFind = jest
        .spyOn(repositoryMock, 'find')
        .mockResolvedValue(clients);

      const result = await service.findAll();

      expect(result).toEqual(clients);
      expect(spyFind).toHaveBeenCalledWith({
        order: {
          id: 'DESC',
        },
      });
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
