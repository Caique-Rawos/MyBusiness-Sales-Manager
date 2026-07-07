import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { TipoMovimento } from '../../domain/movimento_estoque';
import { MovimentoEstoqueTypeOrmRepository } from './movimento_estoque.repository';

describe('MovimentoEstoqueTypeOrmRepository', () => {
  let typeOrmRepository: any;
  let repository: MovimentoEstoqueTypeOrmRepository;

  beforeEach(() => {
    typeOrmRepository = { save: jest.fn(), findOne: jest.fn(), find: jest.fn() };
    const tenantContext: any = { getRepository: jest.fn().mockReturnValue(typeOrmRepository) };
    repository = new MovimentoEstoqueTypeOrmRepository(tenantContext);
  });

  it('should save a movimento', async () => {
    const data = { tipo: TipoMovimento.ENTRADA, quantidade: 10, idProduto: 1 };
    const saved = { id: 1, ...data };
    typeOrmRepository.save.mockResolvedValue(saved);
    await expect(repository.registrar(data)).resolves.toBe(saved);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(data);
  });

  it('should find a saida movimento by venda item', async () => {
    const result = { id: 1, tipo: TipoMovimento.SAIDA };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findSaidaPorVendaItem(5)).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
      where: { idVendaItem: 5, tipo: TipoMovimento.SAIDA },
    });
  });

  describe('findAll', () => {
    it('should filter by idProduto when provided', async () => {
      typeOrmRepository.find.mockResolvedValue([]);
      await repository.findAll({ idProduto: 7 });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { idProduto: 7 },
        relations: ['produto'],
        order: { dataMovimento: 'DESC' },
      });
    });

    it('should filter by date range when dataInicio and dataFim are provided', async () => {
      const dataInicio = new Date('2024-01-01');
      const dataFim = new Date('2024-01-31');
      typeOrmRepository.find.mockResolvedValue([]);
      await repository.findAll({ dataInicio, dataFim });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { dataMovimento: Between(dataInicio, dataFim) },
        relations: ['produto'],
        order: { dataMovimento: 'DESC' },
      });
    });

    it('should filter from dataInicio onward when only dataInicio is provided', async () => {
      const dataInicio = new Date('2024-01-01');
      typeOrmRepository.find.mockResolvedValue([]);
      await repository.findAll({ dataInicio });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { dataMovimento: MoreThanOrEqual(dataInicio) },
        relations: ['produto'],
        order: { dataMovimento: 'DESC' },
      });
    });

    it('should filter up to dataFim when only dataFim is provided', async () => {
      const dataFim = new Date('2024-01-31');
      typeOrmRepository.find.mockResolvedValue([]);
      await repository.findAll({ dataFim });
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { dataMovimento: LessThanOrEqual(dataFim) },
        relations: ['produto'],
        order: { dataMovimento: 'DESC' },
      });
    });

    it('should find all without filters when filtro is empty', async () => {
      typeOrmRepository.find.mockResolvedValue([]);
      await repository.findAll({});
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['produto'],
        order: { dataMovimento: 'DESC' },
      });
    });
  });
});
