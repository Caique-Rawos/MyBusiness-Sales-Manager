import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PERMISSAO_REPOSITORY, PermissaoRepository } from '../domain/permissao.repository';
import { PERMISSION_CATALOG } from './permission-catalog';

@Injectable()
export class PermissionSeedService implements OnModuleInit {
  constructor(
    @Inject(PERMISSAO_REPOSITORY)
    private readonly permissaoRepository: PermissaoRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.permissaoRepository.upsertMany(PERMISSION_CATALOG);
  }
}
