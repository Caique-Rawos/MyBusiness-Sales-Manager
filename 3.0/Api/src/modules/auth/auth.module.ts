import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from '../tenant/tenant.module';
import { AuthService } from './application/auth.service';
import { REFRESH_TOKEN_REPOSITORY } from './domain/refresh-token.repository';
import { USUARIO_REPOSITORY } from './domain/usuario.repository';
import { RefreshTokenOrmEntity } from './infra/typeorm/refresh-token.entity';
import { RefreshTokenTypeOrmRepository } from './infra/typeorm/refresh-token.repository';
import { UsuarioOrmEntity } from './infra/typeorm/usuario.entity';
import { UsuarioTypeOrmRepository } from './infra/typeorm/usuario.repository';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { PermissionGuard } from './presentation/guards/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioOrmEntity, RefreshTokenOrmEntity]),
    TenantModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: (process.env.JWT_ACCESS_TTL || '15m') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioTypeOrmRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenTypeOrmRepository,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
