import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreatePagamentoDto } from '../../application/dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../../application/dto/update-pagamento.dto';
import { Pagamento } from '../../domain/pagamento';
import { PagamentoRepository } from '../../domain/pagamento.repository';
import { PagamentoOrmEntity } from './pagamento.entity';

@Injectable()
export class PagamentoTypeOrmRepository implements PagamentoRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<PagamentoOrmEntity> {
    return this.tenantContext.getRepository(PagamentoOrmEntity);
  }

  async create(data: CreatePagamentoDto): Promise<Pagamento> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Pagamento[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<Pagamento | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdatePagamentoDto): Promise<Pagamento> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}