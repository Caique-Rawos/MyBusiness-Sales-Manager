import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from 'src/shared/queue-names';
import { EstoqueService } from './estoque.service';

@Processor(QUEUE_NAMES.ESTOQUE)
export class EstoqueProcessor extends WorkerHost {
  constructor(private readonly estoqueService: EstoqueService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === JOB_NAMES.ESTOQUE.SAIDA) {
      await this.estoqueService.registrarSaida(job.data);
    } else if (job.name === JOB_NAMES.ESTOQUE.ESTORNO) {
      await this.estoqueService.registrarEstorno(job.data.idVendaItem);
    } else if (job.name === JOB_NAMES.ESTOQUE.ENTRADA) {
      await this.estoqueService.registrarEntrada(job.data);
    }
  }
}
