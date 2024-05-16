import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContasReceberEntity } from './entity/contas_receber.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContasReceberService {
  constructor(
    @InjectRepository(ContasReceberEntity)
    private repository: Repository<ContasReceberEntity>,
  ) {}

  async create(data: ContasReceberEntity): Promise<ContasReceberEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ContasReceberEntity[]> {
    return this.repository.find({
      relations: ['pagamento', 'statusPagamento', 'venda'],
    });
  }
}
