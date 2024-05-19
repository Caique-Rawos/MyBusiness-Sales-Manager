import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from './entity/cliente.entity';

describe('ClienteService', () => {
  let service: ClienteService;
  let repository: Repository<ClienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: getRepositoryToken(ClienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
    repository = module.get<Repository<ClienteEntity>>(
      getRepositoryToken(ClienteEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const clienteData: ClienteEntity = {
        id: 1,
        nome: 'Teste',
        cpfCnpj: '123231123',
      };

      jest.spyOn(repository, 'create').mockReturnValue(clienteData);
      jest.spyOn(repository, 'save').mockResolvedValue(clienteData);

      const result = await service.create(clienteData);

      expect(result).toEqual(clienteData);
      expect(repository.create).toHaveBeenCalledWith(clienteData);
      expect(repository.save).toHaveBeenCalledWith(clienteData);
    });
  });

  describe('findAll', () => {
    it('should return all clients ordered by id in descending order', async () => {
      const clients: ClienteEntity[] = [
        {
          id: 1,
          nome: 'Teste',
          cpfCnpj: '123231123',
        },
        {
          id: 2,
          nome: 'Teste 2',
          cpfCnpj: '1234534232',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(clients);

      const result = await service.findAll();

      expect(result).toEqual(clients);
      expect(repository.find).toHaveBeenCalledWith({
        order: {
          id: 'DESC',
        },
      });
    });
  });
});
