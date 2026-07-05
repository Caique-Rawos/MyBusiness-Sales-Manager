import { EstoqueService } from './estoque.service';

let repository: any;
let produtoService: any;
let service: EstoqueService;

describe('EstoqueService', () => {
  beforeEach(() => {
    repository = {
      registrar: jest.fn(),
      findSaidaPorVendaItem: jest.fn(),
      findAll: jest.fn(),
    };
    produtoService = { ajustarEstoque: jest.fn().mockResolvedValue(undefined) };
    service = new EstoqueService(repository as any, produtoService);
  });

  it('should registrar entrada and record movement', async () => {
    repository.registrar.mockResolvedValue({});
    const data = { idProduto: 1, quantidade: 10, motivo: 'Cadastro de produto' };
    await expect(service.registrarEntrada(data)).resolves.toBeUndefined();
    expect(repository.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'ENTRADA', quantidade: 10, idProduto: 1, motivo: 'Cadastro de produto' }),
    );
    expect(produtoService.ajustarEstoque).not.toHaveBeenCalled();
  });

  it('should registrar saida and ajustar estoque', async () => {
    repository.registrar.mockResolvedValue({});
    const data = { idProduto: 1, quantidade: 3, idVenda: 10, idVendaItem: 20 };
    await expect(service.registrarSaida(data)).resolves.toBeUndefined();
    expect(repository.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'SAIDA', quantidade: 3, idProduto: 1 }),
    );
    expect(produtoService.ajustarEstoque).toHaveBeenCalledWith(1, -3);
  });

  it('should registrar estorno and ajustar estoque', async () => {
    const movimento = { idProduto: 1, quantidade: 3, idVenda: 10 };
    repository.findSaidaPorVendaItem.mockResolvedValue(movimento);
    repository.registrar.mockResolvedValue({});
    await expect(service.registrarEstorno(20)).resolves.toBeUndefined();
    expect(repository.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ tipo: 'ESTORNO_SAIDA', idVendaItem: 20 }),
    );
    expect(produtoService.ajustarEstoque).toHaveBeenCalledWith(1, 3);
  });

  it('should skip estorno when no saida movimento found', async () => {
    repository.findSaidaPorVendaItem.mockResolvedValue(null);
    await expect(service.registrarEstorno(20)).resolves.toBeUndefined();
    expect(repository.registrar).not.toHaveBeenCalled();
  });

  it('should findAll with filtro', async () => {
    const filtro = { idProduto: 5 } as any;
    const expected = [{ id: 1 }] as any;
    repository.findAll.mockResolvedValue(expected);
    await expect(service.findAll(filtro)).resolves.toBe(expected);
    expect(repository.findAll).toHaveBeenCalledWith(filtro);
  });
});
