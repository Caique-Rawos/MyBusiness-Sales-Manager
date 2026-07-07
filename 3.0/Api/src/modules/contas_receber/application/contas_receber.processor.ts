import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { ContasReceberService } from './contas_receber.service';

@Processor(QUEUE_NAMES.CONTAS_RECEBER)
export class ContasReceberProcessor extends WorkerHost {
  constructor(
    private readonly contasReceberService: ContasReceberService,
    private readonly tenantContext: TenantContextService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    return this.tenantContext.runWithTenant(
      { schema: job.data.schema, tenantId: job.data.tenantId },
      async () => {
        if (job.name === JOB_NAMES.CONTAS_RECEBER.CRIAR) {
          await this.handleCriar(job.data);
        } else if (job.name === JOB_NAMES.CONTAS_RECEBER.ATUALIZAR_TOTAL) {
          await this.contasReceberService.atualizaTotal({
            id_venda: job.data.idVenda,
            total: job.data.total,
          });
        }
      },
    );
  }

  private async handleCriar(data: {
    idVenda: number;
    descricao: string;
    idPagamento?: number;
    idStatusPagamento?: number;
  }): Promise<void> {
    await this.contasReceberService.create({
      descricao: data.descricao,
      valorTotal: 0,
      idPagamento: data.idPagamento,
      idStatusPagamento: data.idStatusPagamento,
      idVenda: data.idVenda,
    });
  }
}
