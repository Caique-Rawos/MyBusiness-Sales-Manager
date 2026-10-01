import { CrachaRfidTypeOrmRepository } from './cracha_rfid.repository';

describe('CrachaRfidTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: CrachaRfidTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };
    repository = new CrachaRfidTypeOrmRepository(typeOrmRepository as any);
  });

  it('should create an entity', async () => {
    const dto = { nome: 'Maria', hash: 'abc' };
    const entity = { id: 1, ...dto };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create(dto)).resolves.toBe(entity);
    expect(typeOrmRepository.create).toHaveBeenCalledWith(dto);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should find all entities', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAll()).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalledWith({ order: { id: 'DESC' } });
  });

  it('should find entity by id', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findById(1)).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should find entity by hash', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findByHash('abc')).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { hash: 'abc' } });
  });
});