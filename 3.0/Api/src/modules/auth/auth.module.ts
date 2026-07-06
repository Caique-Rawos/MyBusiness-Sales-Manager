import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaModule } from '../loja/loja.module';
import { TenantModule } from '../tenant/tenant.module';
import { AuthService } from './application/auth.service';
import { PermissionSeedService } from './application/permission-seed.service';
import { TenantProvisioningService } from './application/tenant-provisioning.service';
import { PAPEL_REPOSITORY } from './domain/papel.repository';
import { PERMISSAO_REPOSITORY } from './domain/permissao.repository';
import { REFRESH_TOKEN_REPOSITORY } from './domain/refresh-token.repository';
import { USUARIO_REPOSITORY } from './domain/usuario.repository';
import { PapelOrmEntity } from './infra/typeorm/papel.entity';
import { PapelTypeOrmRepository } from './infra/typeorm/papel.repository';
import { PermissaoOrmEntity } from './infra/typeorm/permissao.entity';
import { PermissaoTypeOrmRepository } from './infra/typeorm/permissao.repository';
import { RefreshTokenOrmEntity } from './infra/typeorm/refresh-token.entity';
import { RefreshTokenTypeOrmRepository } from './infra/typeorm/refresh-token.repository';
import { UsuarioOrmEntity } from './infra/typeorm/usuario.entity';
import { UsuarioTypeOrmRepository } from './infra/typeorm/usuario.repository';
import { AuthController } from './presentation/auth.controller';
import { SignupController } from './presentation/signup.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { PermissionGuard } from './presentation/guards/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioOrmEntity,
      RefreshTokenOrmEntity,
      PapelOrmEntity,
      PermissaoOrmEntity,
    ]),
    TenantModule,
    LojaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: (process.env.JWT_ACCESS_TTL || '15m') as any },
      }),
    }),
  ],
  controllers: [AuthController, SignupController],
  providers: [
    AuthService,
    PermissionSeedService,
    TenantProvisioningService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioTypeOrmRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenTypeOrmRepository,
    },
    {
      provide: PAPEL_REPOSITORY,
      useClass: PapelTypeOrmRepository,
    },
    {
      provide: PERMISSAO_REPOSITORY,
      useClass: PermissaoTypeOrmRepository,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
