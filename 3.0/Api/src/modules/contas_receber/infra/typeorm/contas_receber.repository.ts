import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreateContasReceberInterno } from '../../application/dto/create-contas_receber.dto';
import { UpdateContasReceberDto } from '../../application/dto/update-contas_receber.dto';
import { ContasReceber } from '../../domain/contas_receber';
import { ContasReceberRepository } from '../../domain/contas_receber.repository';
import { ContasReceberOrmEntity } from './contas_receber.entity';

@Injectable()
export class ContasReceberTypeOrmRepository implements ContasReceberRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<ContasReceberOrmEntity> {
    return this.tenantContext.getRepository(ContasReceberOrmEntity);
  }

  async create(data: CreateContasReceberInterno): Promise<ContasReceber> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<ContasReceber[]> {
    return this.repository.find({
      relations: ['pagamento', 'statusPagamento', 'venda'],
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<ContasReceber | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['pagamento', 'statusPagamento', 'venda'],
    });
  }

  async findByVendaId(idVenda: number): Promise<ContasReceber | null> {
    return this.repository.findOne({ where: { idVenda } });
  }

  async update(id: number, data: UpdateContasReceberDto): Promise<ContasReceber> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
      relations: ['pagamento', 'statusPagamento', 'venda'],
    });
  }

  async updateValorTotal(id: number, valorTotal: number): Promise<void> {
    await this.repository.update(id, { valorTotal });
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