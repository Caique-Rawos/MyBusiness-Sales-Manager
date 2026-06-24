import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ContasPagarService } from 'src/modules/contas_pagar/application/contas_pagar.service';
import { ContasReceberService } from 'src/modules/contas_receber/application/contas_receber.service';
import {
  STATUS_PAGAMENTO_REPOSITORY,
  StatusPagamentoRepository,
} from '../domain/status_pagamento.repository';
import { CreateStatusPagamentoDto } from './dto/create-status_pagamento.dto';
import { UpdateStatusPagamentoDto } from './dto/update-status_pagamento.dto';
import { StatusPagamento } from '../domain/status_pagamento';

@Injectable()
export class StatusPagamentoService {
  constructor(
    @Inject(STATUS_PAGAMENTO_REPOSITORY)
    private readonly repository: StatusPagamentoRepository,
    private readonly contasReceberService: ContasReceberService,
    private readonly contasPagarService: ContasPagarService,
  ) {}

  create(data: CreateStatusPagamentoDto): Promise<StatusPagamento> {
    return this.repository.create(data);
  }

  findAll(): Promise<StatusPagamento[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<StatusPagamento> {
    const status = await this.repository.findById(id);
    if (!status) {
      throw new NotFoundException('StatusPagamento not found');
    }
    return status;
  }

  async update(id: number, data: UpdateStatusPagamentoDto): Promise<StatusPagamento> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('StatusPagamento not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('StatusPagamento not found');
    }

    const [emReceber, emPagar] = await Promise.all([
      this.contasReceberService.existsByStatusPagamentoId(id),
      this.contasPagarService.existsByStatusPagamentoId(id),
    ]);

    if (emReceber || emPagar) {
      throw new ConflictException(
        'Status de pagamento possui contas vinculadas e não pode ser removido',
      );
    }

    await this.repository.delete(id);
  }
}
