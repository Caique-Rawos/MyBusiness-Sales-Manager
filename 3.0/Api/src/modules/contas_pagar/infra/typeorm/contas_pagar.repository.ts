import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreateContasPagarDto } from '../../application/dto/create-contas_pagar.dto';
import { UpdateContasPagarDto } from '../../application/dto/update-contas_pagar.dto';
import { ContasPagar } from '../../domain/contas_pagar';
import { ContasPagarRepository } from '../../domain/contas_pagar.repository';
import { ContasPagarOrmEntity } from './contas_pagar.entity';

@Injectable()
export class ContasPagarTypeOrmRepository implements ContasPagarRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<ContasPagarOrmEntity> {
    return this.tenantContext.getRepository(ContasPagarOrmEntity);
  }

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

  async existsByPagamentoId(idPagamento: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idPagamento } });
    return count > 0;
  }

  async existsByStatusPagamentoId(idStatusPagamento: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idStatusPagamento } });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}