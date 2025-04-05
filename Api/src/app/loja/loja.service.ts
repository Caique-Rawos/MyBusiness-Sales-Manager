import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LojaEntity } from './entity/loja.entity';

@Injectable()
export class LojaService {
  constructor(
    @InjectRepository(LojaEntity)
    private repository: Repository<LojaEntity>,
  ) {}

  create(data: LojaEntity): Promise<LojaEntity> {
    const object = this.repository.create({ ...data, id: 1 });
    return this.repository.save(object);
  }

  async findOnly(): Promise<LojaEntity> {
    return this.repository.findOne({ where: { id: 1 } });
  }
}
