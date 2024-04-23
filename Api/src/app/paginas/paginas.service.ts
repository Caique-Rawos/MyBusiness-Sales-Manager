import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginasEntity } from './entity/paginas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaginasService {
  constructor(
    @InjectRepository(PaginasEntity)
    private repository: Repository<PaginasEntity>,
  ) {}

  async getPaginaByAlias(alias: string): Promise<PaginasEntity> {
    return await this.repository.findOne({ where: { alias: alias } });
  }
}
