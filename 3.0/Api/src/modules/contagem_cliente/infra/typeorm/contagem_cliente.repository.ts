import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { TenantContextService } from '../../../../shared/tenant/tenant-context.service';
import { ContagemCliente } from '../../domain/contagem_cliente';
import { ContagemClienteRepository } from '../../domain/contagem_cliente.repository';
import { ContagemClienteOrmEntity } from './contagem_cliente.entity';

@Injectable()
export class ClienteTypeOrmRepository implements ContagemClienteRepository {
  constructor(private readonly tenantContext: TenantContextService) {}

  private get repository(): Repository<ContagemClienteOrmEntity> {
    return this.tenantContext.getRepository(ContagemClienteOrmEntity);
  }

  async findToday(): Promise<ContagemCliente | null> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.repository.findOne({
      where: {
        data: Between(start, end),
      },
    });
  }

  async update(data: ContagemCliente): Promise<void> {
    await this.repository.update(data.id, data);
  }

  async create(): Promise<void> {
    const data = new Date();
    data.setHours(0, 0, 0, 0);
    await this.repository.save({ contagem: 1, data });
  }
}
