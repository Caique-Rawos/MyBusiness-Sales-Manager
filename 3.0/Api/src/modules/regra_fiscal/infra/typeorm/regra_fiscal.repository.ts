import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreateRegraFiscalDto } from '../../application/dto/create-regra_fiscal.dto';
import { UpdateRegraFiscalDto } from '../../application/dto/update-regra_fiscal.dto';
import { RegraFiscal } from '../../domain/regra_fiscal';
import { RegraFiscalRepository } from '../../domain/regra_fiscal.repository';
import { RegraFiscalOrmEntity } from './regra_fiscal.entity';

@Injectable()
export class RegraFiscalTypeOrmRepository implements RegraFiscalRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<RegraFiscalOrmEntity> {
    return this.tenantContext.getRepository(RegraFiscalOrmEntity);
  }

  async create(data: CreateRegraFiscalDto): Promise<RegraFiscal> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<RegraFiscal[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findById(id: number): Promise<RegraFiscal | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateRegraFiscalDto): Promise<RegraFiscal> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}