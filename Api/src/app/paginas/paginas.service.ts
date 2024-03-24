import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginasEntity } from './entity/paginas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaginasService {
  constructor(
    @InjectRepository(PaginasEntity)
    private paginasRepository: Repository<PaginasEntity>,
  ) {}

  async getPaginaByAlias(alias: string): Promise<PaginasEntity> {
    return await this.paginasRepository.findOne({ where: { alias: alias } });
  }
}
