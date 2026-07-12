import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRefreshTokenData,
  RefreshTokenRepository,
} from '../../domain/refresh-token.repository';
import { RefreshToken } from '../../domain/refresh-token';
import { RefreshTokenOrmEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenTypeOrmRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repository: Repository<RefreshTokenOrmEntity>,
  ) {}

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repository.findOne({ where: { tokenHash } });
  }

  async revogar(id: number): Promise<void> {
    await this.repository.update(id, { revogadoEm: new Date() });
  }
}
