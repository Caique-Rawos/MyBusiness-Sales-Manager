import { ConflictException, NotFoundException } from '@nestjs/common';
import { JOB_NAMES } from 'src/shared/queue-names';
import { ProdutoService } from './produto.service';

let repository: any;
let vendaItemService: any;
let estoqueQueue: any;
let tenantContext: any;
let service: ProdutoService;

describe('ProdutoService', () => {
  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByRegraFiscalId: jest.fn(),
      existsByCategoriaId: jest.fn(),
      updateEstoque: jest.fn(),
    };
    vendaItemService = {
      existsByProdutoId: jest.fn().mockResolvedValue(false),
    };
    estoqueQueue = { add: jest.fn().mockResolvedValue(undefined) };
    tenantContext = { getTenant: jest.fn().mockReturnValue({ schema: 'public', tenantId: 0 }) };
    service = new ProdutoService(repository as any, vendaItemService, estoqueQueue, tenantContext);
  });

  it('should create produto without emitting entry when estoque is 0', async () => {
    const dto = { descricao: 'Produto', estoque: 0 } as any;
    const created = { id: 1, estoque: 0 } as any;
    repository.create.mockResolvedValue(created);
    await expect(service.create(dto)).resolves.toBe(created);
    expect(estoqueQueue.add).not.toHaveBeenCalled();
  });

  it('should create produto and emit entrada job when estoque > 0', async () => {
    const dto = { descricao: 'Produto', estoque: 10 } as any;
    const created = { id: 5, estoque: 10 } as any;
    repository.create.mockResolvedValue(created);
    await expect(service.create(dto)).resolves.toBe(created);
    expect(estoqueQueue.add).toHaveBeenCalledWith(JOB_NAMES.ESTOQUE.ENTRADA, {
      idProduto: 5,
      quantidade: 10,
      motivo: 'Cadastro de produto',
      schema: 'public',
      tenantId: 0,
    });
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

  it('should update when entity exists', async () => {
    const expected = {} as any;
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue(expected);
    await expect(service.update(1, {} as any)).resolves.toBe(expected);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalledWith(1, {});
  });

  it('should throw NotFoundException when update entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should delete when produto is not referenced', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    vendaItemService.existsByProdutoId.mockResolvedValue(false);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw ConflictException when produto is referenced in venda_item', async () => {
    repository.findById.mockResolvedValue({ id: 1 } as any);
    vendaItemService.existsByProdutoId.mockResolvedValue(true);
    await expect(service.delete(1)).rejects.toThrow(ConflictException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });

  it('should ajustar estoque applying delta to current stock', async () => {
    repository.findById.mockResolvedValue({ id: 1, estoque: '10' } as any);
    repository.updateEstoque.mockResolvedValue(undefined);
    await expect(service.ajustarEstoque(1, -3)).resolves.toBeUndefined();
    expect(repository.updateEstoque).toHaveBeenCalledWith(1, 7);
  });

  it('should silently skip ajustarEstoque when produto not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.ajustarEstoque(1, -3)).resolves.toBeUndefined();
    expect(repository.updateEstoque).not.toHaveBeenCalled();
  });

  it('should check if regra fiscal is referenced', async () => {
    repository.existsByRegraFiscalId.mockResolvedValue(true);
    await expect(service.existsByRegraFiscalId(1)).resolves.toBe(true);
    expect(repository.existsByRegraFiscalId).toHaveBeenCalledWith(1);
  });

  it('should check if categoria is referenced', async () => {
    repository.existsByCategoriaId.mockResolvedValue(false);
    await expect(service.existsByCategoriaId(1)).resolves.toBe(false);
    expect(repository.existsByCategoriaId).toHaveBeenCalledWith(1);
  });
});
