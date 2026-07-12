import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantData, TenantRepository } from '../../domain/tenant.repository';
import { Tenant } from '../../domain/tenant';
import { TenantOrmEntity } from './tenant.entity';

@Injectable()
export class TenantTypeOrmRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly repository: Repository<TenantOrmEntity>,
  ) {}

  async create(data: CreateTenantData): Promise<Tenant> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async update(id: number, data: Partial<CreateTenantData>): Promise<Tenant> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async findById(id: number): Promise<Tenant | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAllAtivos(): Promise<Tenant[]> {
    return this.repository.find({ where: { ativo: true } });
  }
}
