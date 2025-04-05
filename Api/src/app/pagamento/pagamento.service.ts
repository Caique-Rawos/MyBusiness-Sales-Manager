import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagamentoEntity } from './entity/pagamento.entity';

@Injectable()
export class PagamentoService {
  constructor(
    @InjectRepository(PagamentoEntity)
    private repository: Repository<PagamentoEntity>,
  ) {}

  async create(data: PagamentoEntity): Promise<PagamentoEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<PagamentoEntity[]> {
    return this.repository.find();
  }
}
