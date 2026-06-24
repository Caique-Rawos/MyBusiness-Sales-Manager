import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VendaUpdateDto } from '../../venda/application/dto/atualizaTotalVenda.dto';
import { ContasReceber } from '../domain/contas_receber';
import {
  CONTAS_RECEBER_REPOSITORY,
  ContasReceberRepository,
} from '../domain/contas_receber.repository';
import { CreateContasReceberDto } from './dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from './dto/update-contas_receber.dto';

@Injectable()
export class ContasReceberService {
  constructor(
    @Inject(CONTAS_RECEBER_REPOSITORY)
    private readonly repository: ContasReceberRepository,
  ) {}

  create(data: CreateContasReceberDto): Promise<ContasReceber> {
    return this.repository.create(data);
  }

  findAll(): Promise<ContasReceber[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<ContasReceber> {
    const contas = await this.repository.findById(id);
    if (!contas) {
      throw new NotFoundException('ContasReceber not found');
    }
    return contas;
  }

  async update(
    id: number,
    data: UpdateContasReceberDto,
  ): Promise<ContasReceber> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('ContasReceber not found');
    }

    if (exists.idVenda) {
      delete data.valorTotal;
      delete data.idVenda;
    }

    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('ContasReceber not found');
    }

    if (exists.idVenda) {
      throw new ConflictException(
        'Conta vinculada a uma venda não pode ser excluída',
      );
    }

    await this.repository.delete(id);
  }

  existsByPagamentoId(idPagamento: number): Promise<boolean> {
    return this.repository.existsByPagamentoId(idPagamento);
  }

  existsByStatusPagamentoId(idStatusPagamento: number): Promise<boolean> {
    return this.repository.existsByStatusPagamentoId(idStatusPagamento);
  }

  async atualizaTotal(vendaUpdateDto: VendaUpdateDto): Promise<void> {
    const receber = await this.repository.findByVendaId(
      vendaUpdateDto.id_venda,
    );
    if (!receber) {
      throw new NotFoundException('ContasReceber not found');
    }
    await this.repository.update(receber.id, {
      valorTotal: vendaUpdateDto.total,
    });
  }
}
