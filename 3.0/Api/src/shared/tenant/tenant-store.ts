export interface TenantStore {
  schema: string;
  tenantId: number;
  permissions?: string[];
}

export const DEFAULT_SCHEMA = 'public';

export const DEFAULT_TENANT_STORE: TenantStore = {
  schema: DEFAULT_SCHEMA,
  tenantId: 0,
};
