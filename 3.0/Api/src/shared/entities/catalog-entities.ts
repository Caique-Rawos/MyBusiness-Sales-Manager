import { EntitySchema } from 'typeorm';
import { TenantOrmEntity } from '../../modules/tenant/infra/typeorm/tenant.entity';
import { UsuarioOrmEntity } from '../../modules/auth/infra/typeorm/usuario.entity';
import { PapelOrmEntity } from '../../modules/auth/infra/typeorm/papel.entity';
import { PermissaoOrmEntity } from '../../modules/auth/infra/typeorm/permissao.entity';
import { RefreshTokenOrmEntity } from '../../modules/auth/infra/typeorm/refresh-token.entity';

export const catalogEntities: (Function | string | EntitySchema)[] = [
  TenantOrmEntity,
  UsuarioOrmEntity,
  PapelOrmEntity,
  PermissaoOrmEntity,
  RefreshTokenOrmEntity,
];
