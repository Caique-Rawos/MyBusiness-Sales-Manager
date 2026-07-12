import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { EstoqueService } from './estoque.service';

@Processor(QUEUE_NAMES.ESTOQUE)
export class EstoqueProcessor extends WorkerHost {
  constructor(
    private readonly estoqueService: EstoqueService,
    private readonly tenantContext: TenantContextService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    return this.tenantContext.runWithTenant(
      { schema: job.data.schema, tenantId: job.data.tenantId },
      async () => {
        if (job.name === JOB_NAMES.ESTOQUE.SAIDA) {
          await this.estoqueService.registrarSaida(job.data);
        } else if (job.name === JOB_NAMES.ESTOQUE.ESTORNO) {
          await this.estoqueService.registrarEstorno(job.data.idVendaItem);
        } else if (job.name === JOB_NAMES.ESTOQUE.ENTRADA) {
          await this.estoqueService.registrarEntrada(job.data);
        }
      },
    );
  }
}
