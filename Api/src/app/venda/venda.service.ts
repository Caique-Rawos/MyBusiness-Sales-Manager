import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendaEntity } from './entity/venda.entity';
import { Repository } from 'typeorm';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(VendaEntity)
    private repository: Repository<VendaEntity>,
    private serviceContasReceber: ContasReceberService,
  ) {}

  async create(data: VendaEntity): Promise<VendaEntity> {
    const object = await this.repository.create(data);
    return this.repository.save(object);
  }

  async findAll(): Promise<VendaEntity[]> {
    return this.repository.find({ relations: ['cliente'] });
  }
}
