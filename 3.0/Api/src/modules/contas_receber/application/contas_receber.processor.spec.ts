import { JOB_NAMES } from 'src/shared/queue-names';
import { ContasReceberProcessor } from './contas_receber.processor';

describe('ContasReceberProcessor', () => {
  let contasReceberService: any;
  let tenantContext: any;
  let processor: ContasReceberProcessor;

  beforeEach(() => {
    contasReceberService = {
      create: jest.fn().mockResolvedValue(undefined),
      atualizaTotal: jest.fn().mockResolvedValue(undefined),
    };
    tenantContext = {
      runWithTenant: jest.fn().mockImplementation((_store: unknown, fn: () => Promise<unknown>) => fn()),
    };
    processor = new ContasReceberProcessor(contasReceberService, tenantContext);
  });

  it('should create a contas_receber without forma/status de pagamento', async () => {
    const data = {
      idVenda: 1,
      descricao: 'Lançamento de Venda',
      schema: 'tenant_1',
      tenantId: 1,
    };

    await processor.process({ name: JOB_NAMES.CONTAS_RECEBER.CRIAR, data } as any);

    expect(tenantContext.runWithTenant).toHaveBeenCalledWith({ schema: 'tenant_1', tenantId: 1 }, expect.any(Function));
    expect(contasReceberService.create).toHaveBeenCalledWith({
      descricao: 'Lançamento de Venda',
      valorTotal: 0,
      idPagamento: undefined,
      idStatusPagamento: undefined,
      idVenda: 1,
    });
  });

  it('should update the total for the contas_receber linked to the venda', async () => {
    const data = { idVenda: 1, total: 150, schema: 'tenant_1', tenantId: 1 };

    await processor.process({ name: JOB_NAMES.CONTAS_RECEBER.ATUALIZAR_TOTAL, data } as any);

    expect(contasReceberService.atualizaTotal).toHaveBeenCalledWith({ id_venda: 1, total: 150 });
  });

  it('should do nothing for unknown job names', async () => {
    await processor.process({ name: 'job-desconhecido', data: { schema: 'tenant_1', tenantId: 1 } } as any);
    expect(contasReceberService.create).not.toHaveBeenCalled();
    expect(contasReceberService.atualizaTotal).not.toHaveBeenCalled();
  });
});
