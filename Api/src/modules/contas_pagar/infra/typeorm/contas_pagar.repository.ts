import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContasPagarDto } from '../../application/dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from '../../application/dto/update-contas_pagar.dto';
import { ContasPagar } from '../../domain/contas_pagar';
import { ContasPagarRepository } from '../../domain/contas_pagar.repository';
import { ContasPagarOrmEntity } from './contas_pagar.entity';

@Injectable()
export class ContasPagarTypeOrmRepository implements ContasPagarRepository {
  constructor(
    @InjectRepository(ContasPagarOrmEntity)
    private readonly repository: Repository<ContasPagarOrmEntity>,
  ) {}

  async create(data: CreateContasPagarDto): Promise<ContasPagar> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ContasPagar[]> {
    return this.repository.find({
      relations: ['pagamento', 'statusPagamento'],
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<ContasPagar | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['pagamento', 'statusPagamento'],
    });
  }

  async update(id: number, data: UpdateContasPagarDto): Promise<ContasPagar> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
      relations: ['pagamento', 'statusPagamento'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}