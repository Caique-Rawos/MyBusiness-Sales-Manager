import { ConflictException, NotFoundException } from '@nestjs/common';
import { ContasReceberService } from './contas_receber.service';

let repository: any;
let service: ContasReceberService;

describe('ContasReceberService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      updateValorTotal: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      existsByPagamentoId: jest.fn(),
      existsByStatusPagamentoId: jest.fn(),
      findToday: jest.fn(),
      findByAlias: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      findAllGroupByCliente: jest.fn(),
      findAllGroupByData: jest.fn(),
      getCupomItens: jest.fn(),
      atualizaTotal: jest.fn(),
      atualizaEstoque: jest.fn(),
    };
    service = new ContasReceberService(repository as any);
  });

  it('should create', async () => {
    const dto = {} as any;
    const expected = {} as any;
    repository.create.mockResolvedValue(expected);
    await expect(service.create(dto)).resolves.toBe(expected);
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('should find all', async () => {
    const expected = [] as any;
    repository.findAll.mockResolvedValue(expected);
    await expect(service.findAll()).resolves.toBe(expected);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should find by id', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue(expected);
    await expect(service.findById(1)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when findById returns null', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update when entity exists and has no venda link', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue(expected);
    await expect(service.update(1, {} as any)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalledWith(1, {});
  });

  it('should update allowed fields when entity is linked to a venda', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue({ id: 1, idVenda: 5 } as any);
    repository.update.mockResolvedValue(expected);
    const dto = { descricao: 'nova desc', valorPago: 100 } as any;
    await expect(service.update(1, dto)).resolves.toBe(expected);
    expect(repository.update).toHaveBeenCalledWith(1, dto);
  });

  it('should silently ignore valorTotal and idVenda when conta is venda-linked', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue({ id: 1, idVenda: 5 } as any);
    repository.update.mockResolvedValue(expected);
    const dto = { valorTotal: 999, idVenda: 10, valorPago: 50 } as any;
    await expect(service.update(1, dto)).resolves.toBe(expected);
    expect(repository.update).toHaveBeenCalledWith(1, { valorPago: 50 });
  });

  it('should throw NotFoundException when update entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should delete when entity exists and has no venda link', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw ConflictException when deleting a venda-linked conta', async () => {
    repository.findById.mockResolvedValue({ id: 1, idVenda: 5 } as any);
    await expect(service.delete(1)).rejects.toThrow(ConflictException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should check if pagamento is referenced', async () => {
    repository.existsByPagamentoId.mockResolvedValue(true);
    await expect(service.existsByPagamentoId(1)).resolves.toBe(true);
    expect(repository.existsByPagamentoId).toHaveBeenCalledWith(1);
  });

  it('should check if status pagamento is referenced', async () => {
    repository.existsByStatusPagamentoId.mockResolvedValue(false);
    await expect(service.existsByStatusPagamentoId(1)).resolves.toBe(false);
    expect(repository.existsByStatusPagamentoId).toHaveBeenCalledWith(1);
  });

  it('should update total when contas receber exists', async () => {
    repository.findByVendaId.mockResolvedValue({ id: 1 } as any);
    repository.updateValorTotal.mockResolvedValue(undefined);
    await expect(
      service.atualizaTotal({ id_venda: 1, total: 50 }),
    ).resolves.toBeUndefined();
    expect(repository.findByVendaId).toHaveBeenCalledWith(1);
    expect(repository.updateValorTotal).toHaveBeenCalledWith(1, 50);
  });

  it('should throw NotFoundException when contas receber is not found', async () => {
    repository.findByVendaId.mockResolvedValue(null);
    await expect(
      service.atualizaTotal({ id_venda: 1, total: 50 }),
    ).rejects.toThrow(NotFoundException);
  });
});
