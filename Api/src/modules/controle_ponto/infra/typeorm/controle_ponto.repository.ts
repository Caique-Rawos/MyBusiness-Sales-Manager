import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ControlePonto } from '../../domain/controle_ponto';
import { ControlePontoRepository } from '../../domain/controle_ponto.repository';
import { ControlePontoOrmEntity } from './controle_ponto.entity';

@Injectable()
export class ControlePontoTypeOrmRepository implements ControlePontoRepository {
  constructor(
    @InjectRepository(ControlePontoOrmEntity)
    private readonly repository: Repository<ControlePontoOrmEntity>,
  ) {}

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