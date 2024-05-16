import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusPagamentoEntity } from './entity/status_pagamento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusPagamentoService {
  constructor(
    @InjectRepository(StatusPagamentoEntity)
    private repository: Repository<StatusPagamentoEntity>,
  ) {}

  async create(data: StatusPagamentoEntity): Promise<StatusPagamentoEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<StatusPagamentoEntity[]> {
    return this.repository.find();
  }
}
