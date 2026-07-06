import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreatePaginasDto } from '../../application/dto/create-paginas.dto';
import { UpdatePaginasDto } from '../../application/dto/update-paginas.dto';
import { Paginas } from '../../domain/paginas';
import { PaginasRepository } from '../../domain/paginas.repository';
import { PaginasOrmEntity } from './paginas.entity';

@Injectable()
export class PaginasTypeOrmRepository implements PaginasRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<PaginasOrmEntity> {
    return this.tenantContext.getRepository(PaginasOrmEntity);
  }

  async create(data: CreatePaginasDto): Promise<Paginas> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Paginas[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async findByAlias(alias: string): Promise<Paginas | null> {
    return this.repository.findOne({ where: { alias } });
  }

  async update(id: number, data: UpdatePaginasDto): Promise<Paginas> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
