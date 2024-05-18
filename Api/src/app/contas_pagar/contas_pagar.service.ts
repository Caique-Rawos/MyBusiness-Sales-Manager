import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContasPagarEntity } from './entity/contas_pagar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContasPagarService {
  constructor(
    @InjectRepository(ContasPagarEntity)
    private repository: Repository<ContasPagarEntity>,
  ) {}

  async create(data: ContasPagarEntity): Promise<ContasPagarEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ContasPagarEntity[]> {
    return this.repository.find({
      relations: ['pagamento', 'statusPagamento'],
      order: {
        id: 'DESC',
      },
    });
  }
}
