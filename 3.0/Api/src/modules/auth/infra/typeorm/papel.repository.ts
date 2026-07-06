import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePapelData, PapelRepository } from '../../domain/papel.repository';
import { Papel } from '../../domain/papel';
import { PapelOrmEntity } from './papel.entity';

@Injectable()
export class PapelTypeOrmRepository implements PapelRepository {
  constructor(
    @InjectRepository(PapelOrmEntity)
    private readonly repository: Repository<PapelOrmEntity>,
  ) {}

  async create(data: CreatePapelData): Promise<Papel> {
    const object = this.repository.create({
      nome: data.nome,
      tenantId: data.tenantId,
      permissoes: data.permissaoIds.map((id) => ({ id }) as any),
    });
    const saved = await this.repository.save(object);
    return { id: saved.id, nome: saved.nome, tenantId: saved.tenantId };
  }
}
