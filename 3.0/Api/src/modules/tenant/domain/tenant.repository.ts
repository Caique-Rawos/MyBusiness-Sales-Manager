import { Tenant } from './tenant';

export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';

export interface CreateTenantData {
  schemaName: string;
}

export interface TenantRepository {
  create(data: CreateTenantData): Promise<Tenant>;
  update(id: number, data: Partial<CreateTenantData>): Promise<Tenant>;
  findById(id: number): Promise<Tenant | null>;
  findAllAtivos(): Promise<Tenant[]>;
}
