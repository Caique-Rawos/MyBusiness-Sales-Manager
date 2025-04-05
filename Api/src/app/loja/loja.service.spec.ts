import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LojaEntity } from './entity/loja.entity';
import { LojaService } from './loja.service';

const lojaRepositoryMock = {
  create: jest.fn().mockReturnValue({}),
  save: jest.fn().mockReturnValue({}),
  findOne: jest.fn().mockReturnValue({}),
};

const lojaData: LojaEntity = {
  id: 1,
  nomeFantasia: 'teste',
  cpfCnpj: '1231323',
  ie: '12321',
  endereco: 'teste',
};

describe('LojaService', () => {
  let service: LojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojaService,
        {
          provide: getRepositoryToken(LojaEntity),
          useValue: lojaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LojaService>(LojaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new loja', async () => {
    await service.create(lojaData);

    expect(lojaRepositoryMock.create).toHaveBeenCalledWith(lojaData);
    expect(lojaRepositoryMock.save).toHaveBeenCalled();
  });

  it('should return all lojas', async () => {
    const result = await service.findOnly();

    expect(lojaRepositoryMock.findOne).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
