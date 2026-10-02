import { MoreThanOrEqual } from 'typeorm';
import { ControlePontoTypeOrmRepository } from './controle_ponto.repository';

describe('ControlePontoTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: ControlePontoTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    const tenantContext: any = { getRepository: jest.fn().mockReturnValue(typeOrmRepository) };
    repository = new ControlePontoTypeOrmRepository(tenantContext);
  });

  it('should create a punch for the badge', async () => {
    const entity = { id: 1, idCracha: 7, timestamp: new Date() };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create(7)).resolves.toBe(entity);
    expect(typeOrmRepository.create).toHaveBeenCalledWith({ idCracha: 7 });
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });

  it('should find punches of a badge since a date, newest first', async () => {
    const desde = new Date('2026-09-13T12:00:00.000Z');
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findByCrachaSince(7, desde)).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalledWith({
      where: { idCracha: 7, timestamp: MoreThanOrEqual(desde) },
      order: { timestamp: 'DESC' },
    });
  });
});
