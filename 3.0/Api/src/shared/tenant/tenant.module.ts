import { Global, Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';
import { TenantConnectionRegistryService } from './tenant-connection-registry.service';
import { TenantContextService } from './tenant-context.service';
import { DEFAULT_TENANT_STORE } from './tenant-store';
import { TENANT_CLS_KEY } from './tenant-context.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls: ClsService) => {
          cls.set(TENANT_CLS_KEY, DEFAULT_TENANT_STORE);
        },
      },
    }),
  ],
  providers: [TenantConnectionRegistryService, TenantContextService],
  exports: [TenantConnectionRegistryService, TenantContextService],
})
export class TenantConnectionModule {}
