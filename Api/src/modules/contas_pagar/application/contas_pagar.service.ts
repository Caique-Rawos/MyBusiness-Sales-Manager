import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CONTAS_PAGAR_REPOSITORY,
  ContasPagarRepository,
} from '../domain/contas_pagar.repository';
import { CreateContasPagarDto } from './dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from './dto/update-contas_pagar.dto';
import { ContasPagar } from '../domain/contas_pagar';

@Injectable()
export class ContasPagarService {
  constructor(
    @Inject(CONTAS_PAGAR_REPOSITORY)
    private readonly repository: ContasPagarRepository,
  ) {}

  create(data: CreateContasPagarDto): Promise<ContasPagar> {
    return this.repository.create(data);
  }

  findAll(): Promise<ContasPagar[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<ContasPagar> {
    const contas = await this.repository.findById(id);
    if (!contas) {
      throw new NotFoundException('ContasPagar not found');
    }
    return contas;
  }

  async update(id: number, data: UpdateContasPagarDto): Promise<ContasPagar> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('ContasPagar not found');
    }
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new NotFoundException('ContasPagar not found');
    }
    await this.repository.delete(id);
  }

  existsByPagamentoId(idPagamento: number): Promise<boolean> {
    return this.repository.existsByPagamentoId(idPagamento);
  }

  existsByStatusPagamentoId(idStatusPagamento: number): Promise<boolean> {
    return this.repository.existsByStatusPagamentoId(idStatusPagamento);
  }
}