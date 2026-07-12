import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TENANT_REPOSITORY } from './domain/tenant.repository';
import { TenantOrmEntity } from './infra/typeorm/tenant.entity';
import { TenantTypeOrmRepository } from './infra/typeorm/tenant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TenantOrmEntity])],
  providers: [
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantTypeOrmRepository,
    },
  ],
  exports: [TENANT_REPOSITORY],
})
export class TenantModule {}
