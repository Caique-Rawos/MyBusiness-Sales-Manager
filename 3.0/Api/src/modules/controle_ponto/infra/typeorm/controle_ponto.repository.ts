import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { ControlePonto } from '../../domain/controle_ponto';
import { ControlePontoRepository } from '../../domain/controle_ponto.repository';
import { ControlePontoOrmEntity } from './controle_ponto.entity';

@Injectable()
export class ControlePontoTypeOrmRepository implements ControlePontoRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<ControlePontoOrmEntity> {
    return this.tenantContext.getRepository(ControlePontoOrmEntity);
  }

  async create(idCracha: number): Promise<ControlePonto> {
    const object = this.repository.create({ idCracha });
    return this.repository.save(object);
  }

  async findByCrachaSince(idCracha: number, desde: Date): Promise<ControlePonto[]> {
    return this.repository.find({
      where: { idCracha, timestamp: MoreThanOrEqual(desde) },
      order: { timestamp: 'DESC' },
    });
  }
}
