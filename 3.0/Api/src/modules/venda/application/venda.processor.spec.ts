import { JOB_NAMES } from 'src/shared/queue-names';
import { VendaProcessor } from './venda.processor';

describe('VendaProcessor', () => {
  let vendaRepository: any;
  let vendaItemService: any;
  let contasReceberQueue: any;
  let tenantContext: any;
  let processor: VendaProcessor;

  beforeEach(() => {
    vendaRepository = { updateTotal: jest.fn().mockResolvedValue(undefined) };
    vendaItemService = { findByIdVenda: jest.fn() };
    contasReceberQueue = { add: jest.fn().mockResolvedValue(undefined) };
    tenantContext = {
      runWithTenant: jest.fn().mockImplementation((_store: unknown, fn: () => Promise<unknown>) => fn()),
      getTenant: jest.fn().mockReturnValue({ schema: 'tenant_1', tenantId: 1 }),
    };
    processor = new VendaProcessor(vendaRepository, vendaItemService, contasReceberQueue, tenantContext);
  });

  it('should recalculate the total and emit atualizar-total for contas_receber', async () => {
    vendaItemService.findByIdVenda.mockResolvedValue([{ subTotal: '10.5' }, { subTotal: '5' }]);
    const job = { name: JOB_NAMES.VENDA.CALCULAR_TOTAL, data: { idVenda: 1, schema: 'tenant_1', tenantId: 1 } };

    await processor.process(job as any);

    expect(tenantContext.runWithTenant).toHaveBeenCalledWith({ schema: 'tenant_1', tenantId: 1 }, expect.any(Function));
    expect(vendaRepository.updateTotal).toHaveBeenCalledWith(1, 15.5);
    expect(contasReceberQueue.add).toHaveBeenCalledWith(JOB_NAMES.CONTAS_RECEBER.ATUALIZAR_TOTAL, {
      idVenda: 1,
      total: 15.5,
      schema: 'tenant_1',
      tenantId: 1,
    });
  });

  it('should do nothing for unknown job names', async () => {
    const job = { name: 'job-desconhecido', data: { schema: 'tenant_1', tenantId: 1 } };

    await processor.process(job as any);

    expect(vendaItemService.findByIdVenda).not.toHaveBeenCalled();
    expect(vendaRepository.updateTotal).not.toHaveBeenCalled();
  });
});
