import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusPagamentoDto } from '../../application/dto/create-status_pagamento.dto';
import { UpdateStatusPagamentoDto } from '../../application/dto/update-status_pagamento.dto';
import { StatusPagamento } from '../../domain/status_pagamento';
import { StatusPagamentoRepository } from '../../domain/status_pagamento.repository';
import { StatusPagamentoOrmEntity } from './status_pagamento.entity';

@Injectable()
export class StatusPagamentoTypeOrmRepository implements StatusPagamentoRepository {
  constructor(
    @InjectRepository(StatusPagamentoOrmEntity)
    private readonly repository: Repository<StatusPagamentoOrmEntity>,
  ) {}

  async create(data: CreateStatusPagamentoDto): Promise<StatusPagamento> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<StatusPagamento[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<StatusPagamento | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateStatusPagamentoDto): Promise<StatusPagamento> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}