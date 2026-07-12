import { JOB_NAMES } from 'src/shared/queue-names';
import { EstoqueProcessor } from './estoque.processor';

describe('EstoqueProcessor', () => {
  let estoqueService: any;
  let tenantContext: any;
  let processor: EstoqueProcessor;

  beforeEach(() => {
    estoqueService = {
      registrarSaida: jest.fn().mockResolvedValue(undefined),
      registrarEstorno: jest.fn().mockResolvedValue(undefined),
      registrarEntrada: jest.fn().mockResolvedValue(undefined),
    };
    tenantContext = {
      runWithTenant: jest.fn().mockImplementation((_store: unknown, fn: () => Promise<unknown>) => fn()),
    };
    processor = new EstoqueProcessor(estoqueService, tenantContext);
  });

  it('should register a saida', async () => {
    const data = { idProduto: 1, quantidade: 2, idVenda: 1, idVendaItem: 1, schema: 'tenant_1', tenantId: 1 };
    await processor.process({ name: JOB_NAMES.ESTOQUE.SAIDA, data } as any);
    expect(estoqueService.registrarSaida).toHaveBeenCalledWith(data);
  });

  it('should register an estorno', async () => {
    const data = { idVendaItem: 5, schema: 'tenant_1', tenantId: 1 };
    await processor.process({ name: JOB_NAMES.ESTOQUE.ESTORNO, data } as any);
    expect(estoqueService.registrarEstorno).toHaveBeenCalledWith(5);
  });

  it('should register an entrada', async () => {
    const data = { idProduto: 1, quantidade: 10, motivo: 'Cadastro', schema: 'tenant_1', tenantId: 1 };
    await processor.process({ name: JOB_NAMES.ESTOQUE.ENTRADA, data } as any);
    expect(estoqueService.registrarEntrada).toHaveBeenCalledWith(data);
  });

  it('should do nothing for unknown job names', async () => {
    await processor.process({ name: 'job-desconhecido', data: { schema: 'tenant_1', tenantId: 1 } } as any);
    expect(estoqueService.registrarSaida).not.toHaveBeenCalled();
    expect(estoqueService.registrarEstorno).not.toHaveBeenCalled();
    expect(estoqueService.registrarEntrada).not.toHaveBeenCalled();
  });
});
