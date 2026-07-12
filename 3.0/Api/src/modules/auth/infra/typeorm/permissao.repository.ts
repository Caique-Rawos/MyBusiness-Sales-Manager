import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissaoRepository, PermissaoSeedData } from '../../domain/permissao.repository';
import { Permissao } from '../../domain/permissao';
import { PermissaoOrmEntity } from './permissao.entity';

@Injectable()
export class PermissaoTypeOrmRepository implements PermissaoRepository {
  constructor(
    @InjectRepository(PermissaoOrmEntity)
    private readonly repository: Repository<PermissaoOrmEntity>,
  ) {}

  async findAll(): Promise<Permissao[]> {
    return this.repository.find();
  }

  async upsertMany(data: PermissaoSeedData[]): Promise<void> {
    await this.repository.upsert(data, ['chave']);
  }
}
