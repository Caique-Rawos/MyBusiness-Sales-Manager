import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { CreateVendaDto } from '../../application/dto/create-venda.dto';
import { UpdateVendaDto } from '../../application/dto/update-venda.dto';
import { Venda } from '../../domain/venda';
import { IVendaPrevisao } from '../../domain/venda_previsao';
import { VendaRepository } from '../../domain/venda.repository';
import { VendaOrmEntity } from './venda.entity';

@Injectable()
export class VendaTypeOrmRepository implements VendaRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<VendaOrmEntity> {
    return this.tenantContext.getRepository(VendaOrmEntity);
  }

  async create(data: CreateVendaDto): Promise<Venda> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<Venda[]> {
    return this.repository.find({
      relations: ['cliente'],
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Venda | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['cliente'],
    });
  }

  async update(id: number, data: UpdateVendaDto): Promise<Venda> {
    await this.repository.update(id, data);
    return this.repository.findOne({
      where: { id },
      relations: ['cliente'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async existsByClienteId(idCliente: number): Promise<boolean> {
    const count = await this.repository.count({ where: { idCliente } });
    return count > 0;
  }

  async updateTotal(id: number, total: number): Promise<void> {
    await this.repository.update(id, { totalVenda: total });
  }

  async findVendasFuturasBase(): Promise<IVendaPrevisao[]> {
    const query = this.repository
      .createQueryBuilder('venda')
      .select(
        `TO_CHAR(DATE_TRUNC('month', venda."dataVenda"), 'MM-YYYY')`,
        'mes',
      )
      .addSelect('COUNT(*)', 'quantidadeVendas')
      .addSelect(`SUM(venda."totalVenda")`, 'valorTotal')
      .where(`venda."dataVenda" >= NOW() - INTERVAL '24 months'`)
      .groupBy(`DATE_TRUNC('month', venda."dataVenda")`)
      .orderBy(`DATE_TRUNC('month', venda."dataVenda")`, 'ASC');

    return query.getRawMany<IVendaPrevisao>();
  }
}