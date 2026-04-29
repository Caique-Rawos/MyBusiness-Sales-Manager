import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAGAMENTO_REPOSITORY,
  PagamentoRepository,
} from '../domain/pagamento.repository';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { Pagamento } from '../domain/pagamento';

@Injectable()
export class PagamentoService {
  constructor(
    @Inject(PAGAMENTO_REPOSITORY)
    private readonly repository: PagamentoRepository,
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
    await this.repository.delete(id);
  }
}