import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ContasPagarService } from 'src/modules/contas_pagar/application/contas_pagar.service';
import { ContasReceberService } from 'src/modules/contas_receber/application/contas_receber.service';
import { PAGAMENTO_REPOSITORY, PagamentoRepository } from '../domain/pagamento.repository';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { Pagamento } from '../domain/pagamento';

@Injectable()
export class PagamentoService {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly repository: PagamentoRepository,
    private readonly contasReceberService: ContasReceberService,
    private readonly contasPagarService: ContasPagarService,
  ) {}

  create(data: CreatePagamentoDto): Promise<Pagamento> {
    return this.repository.create(data);
  }

  findAll(): Promise<Pagamento[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<Pagamento> {
    const pagamento = await this.repository.findById(id);
    if (!pagamento) {
      throw new NotFoundException('Pagamento not found');
    }
    return pagamento;
  }

  async update(id: number, data: UpdatePagamentoDto): Promise<Pagamento> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Pagamento not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('Pagamento not found');
    }

    const [emReceber, emPagar] = await Promise.all([
      this.contasReceberService.existsByPagamentoId(id),
      this.contasPagarService.existsByPagamentoId(id),
    ]);

    if (emReceber || emPagar) {
      throw new ConflictException(
        'Forma de pagamento possui contas vinculadas e não pode ser removida',
      );
    }

    await this.repository.delete(id);
  }
}
