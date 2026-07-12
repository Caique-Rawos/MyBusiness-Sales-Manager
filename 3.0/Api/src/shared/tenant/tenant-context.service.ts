import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { EntityTarget, Repository } from 'typeorm';
import { TenantConnectionRegistryService } from './tenant-connection-registry.service';
import { DEFAULT_TENANT_STORE, TenantStore } from './tenant-store';

export const TENANT_CLS_KEY = 'tenant';

@Injectable()
export class TenantContextService {
  constructor(
    private readonly cls: ClsService,
    private readonly registry: TenantConnectionRegistryService,
  ) {}

  setTenant(store: TenantStore): void {
    this.cls.set(TENANT_CLS_KEY, store);
  }

  getTenant(): TenantStore {
    return this.cls.get<TenantStore>(TENANT_CLS_KEY) ?? DEFAULT_TENANT_STORE;
  }

  getRepository<T>(entity: EntityTarget<T>): Repository<T> {
    const { schema } = this.getTenant();
    return this.registry.getDataSource(schema).getRepository(entity);
  }

  // Fora de requests HTTP (ex: processors do BullMQ) nao ha contexto cls ativo -- cria um novo.
  runWithTenant<T>(store: TenantStore, fn: () => Promise<T>): Promise<T> {
    return this.cls.runWith({ [TENANT_CLS_KEY]: store } as never, fn);
  }
}
