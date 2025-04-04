import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegraFiscalEntity } from './entity/regra_fiscal.entity';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../cliente/entity/cliente.entity';

@Injectable()
export class RegraFiscalService {
  constructor(
    @InjectRepository(RegraFiscalEntity)
    private repository: Repository<RegraFiscalEntity>,
  ) {}

  create(data: RegraFiscalEntity): Promise<RegraFiscalEntity> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  findAll(): Promise<RegraFiscalEntity[]> {
    return this.repository.find();
  }
}
