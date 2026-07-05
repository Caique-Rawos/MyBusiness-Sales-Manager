import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { VendaItemService } from 'src/modules/venda_item/application/venda_item.service';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { VENDA_REPOSITORY, VendaRepository } from '../domain/venda.repository';

@Processor(QUEUE_NAMES.VENDA)
export class VendaProcessor extends WorkerHost {
  constructor(
    @Inject(VENDA_REPOSITORY)
    private readonly vendaRepository: VendaRepository,
    private readonly vendaItemService: VendaItemService,
    @InjectQueue(QUEUE_NAMES.CONTAS_RECEBER)
    private readonly contasReceberQueue: Queue,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === JOB_NAMES.VENDA.CALCULAR_TOTAL) {
      await this.handleCalcularTotal(job.data);
    }
  }

  private async handleCalcularTotal(data: { idVenda: number }): Promise<void> {
    const items = await this.vendaItemService.findByIdVenda(data.idVenda);
    const total = items.reduce((sum, item) => sum + Number(item.subTotal), 0);
    await this.vendaRepository.updateTotal(data.idVenda, total);
    await this.contasReceberQueue.add(JOB_NAMES.CONTAS_RECEBER.ATUALIZAR_TOTAL, {
      idVenda: data.idVenda,
      total,
    });
  }
}
